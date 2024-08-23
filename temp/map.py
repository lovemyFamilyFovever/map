from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
import logging
import shapefile
import pyproj

app = Flask(__name__)
CORS(app)  # 允许所有域访问

logging.basicConfig(filename='logfile.log', level=logging.DEBUG, format='%(asctime)s %(levelname)s: %(message)s')

# MDB文件路径

# 建立连接
mdb_file_path='C:\\map\\map.mdb'
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
        query = f"SELECT a.DKBM, a.SZX as 所在县市区, a.SZXZ as 所在乡镇, a.JSZK as 建设情况, a.GHYT as 规划用途, a.DXLB as 分类, a.TDMJ as 面积_公顷, ROUND(a.TDMJ*15,3) AS 亩, COUNT(b.TBBM) AS 宗地数_宗, a.BZ as 备注 FROM GYYD0812 a LEFT JOIN QYWZ0812 b ON b.TBBM=a.DKBM WHERE a.SZXZ = '{column_name}' GROUP BY a.DKBM, a.SZX, a.SZXZ, a.JSZK, a.GHYT, a.DXLB, a.TDMJ, a.BZ;"
    else:
        query = f"SELECT * FROM {table_name}"
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return results

def shp_to_geojson(shp_file_path):
    # 读取Shapefile文件
    reader = shapefile.Reader(shp_file_path,encoding='latin1')
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

@app.route('/load_shp')
def load_shp():
     # 从URL参数获取Shapefile文件的路径
    shp_file_path = request.args.get('file_path')

    if shp_file_path:
        try:
            geojson_data = shp_to_geojson('uploads/'+shp_file_path+'.shp')
            return jsonify(geojson_data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "file_path parameter is missing"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
