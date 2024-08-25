from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
import shapefile
import pyproj

app = Flask(__name__)
CORS(app)  # 允许所有域访问

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
def query_table():
    conn = get_connection()
    cursor = conn.cursor()
    query = f"SELECT a.DKBM as 地块编码,a.TDZL as 地块种类,a.XZQDM as 行政区代码,a.SZX as 所在乡,a.SZXZ as 所在乡镇,a.SZC as 所在村,a.TDSYQR as 地块使用权期限,a.YDDW as 用地单位,a.QSXZ as 权属性质,a.SYQLX as 使用期限, a.PZYT, a.GHYT as 规划用途, a.TDMJ as 土地面积, a.PZMJ as 批准面积, a.GYMJ , a.YJCMJ , a.JSZK, a.JZMJ, a.JZJDMJ, a.RJL, a.JZMD, a.SFGSQYYD, a.SFYDDQ, a.DJGDZCTZ, a.DJCZ, a.DJXSSR, a.DJSJSF, a.DJCYRY, a.YDLX, a.YDXWFSSJ, a.CZKFBJNMJ, a.DKJZDJ, a.TDZCJZ, a.SFDXYD, a.DXLB, a.PHFS, a.SSSJ, a.PHPQBH, a.PHPQMC, ROUND(a.TDMJ * 15, 3) AS 亩, COUNT(b.TBBM) AS 宗地数_宗, a.BZ AS 备注 FROM GYYD a LEFT JOIN QYWZ b ON b.TBBM = a.DKBM GROUP BY a.DKBM, a.TDZL, a.XZQDM, a.SZX, a.SZXZ, a.SZC, a.TDSYQR, a.YDDW, a.QSXZ, a.SYQLX, a.PZYT, a.GHYT, a.TDMJ, a.PZMJ, a.GYMJ, a.YJCMJ, a.JSZK, a.JZMJ, a.JZJDMJ, a.RJL, a.JZMD, a.SFGSQYYD, a.SFYDDQ, a.DJGDZCTZ, a.DJCZ, a.DJXSSR, a.DJSJSF, a.DJCYRY, a.YDLX, a.YDXWFSSJ, a.CZKFBJNMJ, a.DKJZDJ, a.TDZCJZ, a.SFDXYD, a.DXLB, a.PHFS, a.SSSJ, a.PHPQBH, a.PHPQMC, a.BZ; "
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return results

# Flask路由，用于处理查询请求
# :return: JSON格式的查询结果
@app.route('/query', methods=['GET'])
def get_data():
    data = query_table()
    return jsonify(data)


# 将Shapefile文件转换为GeoJSON格式的函数
# :param shp_file_path: Shapefile文件的路径
# :return: GeoJSON格式的地图数据
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
