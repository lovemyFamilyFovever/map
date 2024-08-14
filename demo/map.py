from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
import logging

app = Flask(__name__)
CORS(app)  # 允许所有域访问

logging.basicConfig(filename='logfile.log', level=logging.DEBUG, format='%(asctime)s %(levelname)s: %(message)s')

# MDB文件路径

# 建立连接
mdb_file_path='E:\\chen\\map\\demo\\map.mdb'
def get_connection():
    conn_str = (
        r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};'
        r'DBQ='+mdb_file_path+';'
    )
    return pyodbc.connect(conn_str)

# 查询函数
def query_table(table_name, column_name=None, column_value=None):
    conn = get_connection()
    cursor = conn.cursor()
    if column_name:
        query = f"SELECT a.DKBM, a.SZX, a.SZXZ, a.JSZK, a.GHYT, a.DXLB, a.TDMJ, a.BZ, a.TDMJ*15 AS CHNMJ, COUNT(b.TBBM) AS ZONGDI FROM GYYD0812 a LEFT JOIN QYWZ0812 b ON b.TBBM=a.DKBM WHERE a.SZXZ = '{column_name}' GROUP BY a.DKBM, a.SZX, a.SZXZ, a.JSZK, a.GHYT, a.DXLB, a.TDMJ, a.BZ;"
    else:
        query = f"SELECT * FROM {table_name}"
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return results

@app.route('/query', methods=['GET'])
def get_data():
    table_name = request.args.get('table', default='', type=str)
    column_name = request.args.get('column', default=None, type=str)  # 新增列名参数
    column_value = request.args.get('value', default=None, type=str)  # 新增列名参数

    if not table_name:
        return jsonify({"error": "Table name is required"}), 400

    data = query_table(table_name, column_name, column_value)
    logging.info(data)  # 将响应输出到日志文件

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
