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
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)


# 建立连接
# MDB文件路径
mdb_file_path='C:\\map\\map.mdb'
def get_connection():
    conn_str = (
        r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};'
        r'DBQ='+mdb_file_path+';'
    )
    return pyodbc.connect(conn_str)

# 查询数据库表并返回结果。
# :param table_name: 要查询的表名
# :param column_name: 可选，要查询的列名
# :param column_value: 可选，列的值
# :return: 查询结果列表
def query_table(table_name, columns=None):
    conn = get_connection()
    cursor = conn.cursor()

    # 如果没有指定列名，则查询所有列
    if columns:
        columns_str = ", ".join(columns)
    else:
        columns_str = "*"

    query = f"SELECT {columns_str} FROM {table_name}"
    logger.info("---------")
    try:
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        logger.info(f"SQL execution info: {query}")
    except Exception as e:
        logger.error(f"SQL execution error: {query}\nError: {str(e)}")
        raise
    finally:
        cursor.close()
        conn.close()
        logger.info("---------")

    return results

# Flask路由，用于处理查询请求
# :return: JSON格式的查询结果
@app.route('/query', methods=['POST'])
def get_data():
    data = request.get_json()
    table_name = data.get('table_name')
    columns = data.get('columns')

    query_result = query_table(table_name, columns)
    return jsonify(query_result)

# 新增的查询数据的函数
def query_aggregated_data(table_name, select_column, select_column_name,calc_column, calc_type, where_conditions):
    conn = get_connection()
    cursor = conn.cursor()

    # 构建 WHERE 子句
    where_clause = ""  # 初始化 where_clause 为空字符串
    if where_conditions:
        where_clauses = []
        for col, values in where_conditions.items():
            if isinstance(values, list):
                values_str = ", ".join([f"'{val}'" for val in values]) 
                where_clauses.append(f"{col} IN ({values_str})")
            else:
                where_clauses.append(f"{col} = '{values}'")
        where_clause = " AND ".join(where_clauses)

    # 根据 calc_type 设置别名
    alias = {
        "AVG": "平均数",
        "SUM": "总和",
        "COUNT": "总数"
    }.get(calc_type.upper(), "")  # 默认别名为空字符串

    # 构建 SQL 查询语句
    query = f"SELECT {select_column} AS {select_column_name} , {calc_type.upper()}({calc_column})"
  
    if alias:  # 如果有别名，添加 AS 子句
        query += f" AS {alias}"

    query += f" FROM {table_name}"
    
    if where_clause:
        query += f" WHERE {where_clause}"
    
    query += f" GROUP BY {select_column}"

    logger.info("---------")
    results = ""
    try:
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        logger.info(f"SQL execution info: {query}")
    except Exception as e:
        error_code = getattr(e, 'args', [None])[0] if e.args else 'Unknown error'
        logger.error(f"SQL execution error: {query}\nError: {str(e)}")
        results = {"type":"error","msg": "数据字段查询错误", "code": error_code}  # 发生错误时返回错误信息
    finally:
        cursor.close()
        conn.close()
        logger.info("---------")

    return results

# 新增的 Flask 路由，用于处理聚合查询请求
@app.route('/group', methods=['POST'])
def get_aggregated_data():
    data = request.get_json()
    table_name = data.get('tableName')
    select_column = data.get('selectColumn')
    select_column_name = data.get('selectColumnName')
    calc_column = data.get('calcColumn')
    calc_type = data.get('calcType')
    where_conditions = data.get('where', {})

    query_result = query_aggregated_data(table_name, select_column,select_column_name, calc_column, calc_type, where_conditions)
    return jsonify(query_result)

# 将Shapefile文件转换为GeoJSON格式的函数
# :param shp_file_path: Shapefile文件的路径
# :return: GeoJSON格式的地图数据
def shp_to_geojson(shp_file_path):
    # 读取Shapefile文件
    try:
        reader = shapefile.Reader(shp_file_path, encoding='gbk')
        fields = [x[0] for x in reader.fields][1:]
        records = reader.records()
        shps = [s.__geo_interface__ for s in reader.shapes()]

        # 将shp转换为GeoJSON格式
        geojson = {"type": "FeatureCollection", "features": []}
        for i, shp in enumerate(shps):
            geojson["features"].append({
                "type": "Feature",
                "geometry": shp,
                "properties": dict(zip(fields, records[i]))
            })

        return geojson
    except Exception as e:
        logger.error(f"Error converting Shapefile to GeoJSON: {shp_file_path}\nError: {str(e)}")
        raise

# Flask路由，用于处理加载Shapefile文件的请求
# :return: JSON格式的查询结果
@app.route('/load_shp')
def load_shp():
     # 从URL参数获取Shapefile文件的路径
    shp_file_path = request.args.get('file_path')

    if shp_file_path:
        try:
            geojson_data = shp_to_geojson('shp/'+shp_file_path+'.shp')
            return jsonify(geojson_data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "file_path parameter is missing"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
