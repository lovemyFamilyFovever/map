from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
import shapefile
import pyproj
import logging
from logging.handlers import TimedRotatingFileHandler
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许所有域访问

# 获取当前日期，用于日志文件名
current_date = datetime.now().strftime('%Y-%m-%d')
log_filename = f"log-{current_date}.log"

# 配置日志文件路径
log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'log', log_filename)

# 配置日志记录
handler = TimedRotatingFileHandler(log_file, when='D', interval=1, backupCount=30, encoding='utf-8')
handler.setLevel(logging.ERROR)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
logger.addHandler(handler)

# 建立连接
mdb_file_path='C:\\map\\map.mdb'
def get_connection():
    conn_str = (
        r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};'
        r'DBQ='+mdb_file_path+';'
    )
    return pyodbc.connect(conn_str)

# 查询数据库表并返回结果
def query_table(table_name, columns=None):
    conn = get_connection()
    cursor = conn.cursor()

    if columns:
        columns_str = ", ".join(columns)
    else:
        columns_str = "*"

    query = f"SELECT {columns_str} FROM {table_name}"
    try:
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    except Exception as e:
        logger.error(f"SQL execution error: {query}\nError: {str(e)}")
        raise
    finally:
        cursor.close()
        conn.close()

    return results

# 新增的查询数据的函数
def query_aggregated_data(table_name, select_column, calc_column, calc_type, group_column, where_conditions):
    conn = get_connection()
    cursor = conn.cursor()

    # 构建 WHERE 子句
    if where_conditions:
        where_clause = " AND ".join([f"{col}='{val}'" for col, val in where_conditions.items()])
    else:
        where_clause = ""

    # 构建 SQL 查询语句
    query = f"SELECT {select_column}, {calc_type.upper()}({calc_column}) FROM {table_name}"
    if where_clause:
        query += f" WHERE {where_clause}"
    if group_column:
        query += f" GROUP BY {group_column}"

    try:
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    except Exception as e:
        logger.error(f"SQL execution error: {query}\nError: {str(e)}")
        raise
    finally:
        cursor.close()
        conn.close()

    return results

# Flask路由，用于处理查询请求
@app.route('/query', methods=['POST'])
def get_data():
    data = request.get_json()
    table_name = data.get('table_name')
    columns = data.get('columns')

    query_result = query_table(table_name, columns)
    return jsonify(query_result)

# 新增的 Flask 路由，用于处理聚合查询请求
@app.route('/group', methods=['POST'])
def get_aggregated_data():
    data = request.get_json()
    table_name = data.get('table_name')
    select_column = data.get('selectColumn')
    calc_column = data.get('calcColumn')
    calc_type = data.get('calcType')
    group_column = data.get('groupColumn')
    where_conditions = data.get('where', {})

    query_result = query_aggregated_data(table_name, select_column, calc_column, calc_type, group_column, where_conditions)
    return jsonify(query_result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
