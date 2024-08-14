from flask import Flask, jsonify, request
import pyodbc

app = Flask(__name__)

# MDB文件路径
mdb_file = '经开区工业用地调查.mdb'

# 建立连接
def get_connection():
    conn_str = (
        r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};'
        r'DBQ=' + mdb_file + ';'
    )
    return pyodbc.connect(conn_str)

# 查询函数
def query_table(table_name, column_name=None):
    conn = get_connection()
    cursor = conn.cursor()
    if column_name:
        query = f"SELECT {column_name} FROM {table_name}"
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

    if not table_name:
        return jsonify({"error": "Table name is required"}), 400

    data = query_table(table_name, column_name)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
