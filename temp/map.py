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
def query_table(table_name, columns=None):
    conn = get_connection()
    cursor = conn.cursor()

    # 如果没有指定列名，则查询所有列
    if columns:
        columns_str = ", ".join(columns)
    else:
        columns_str = "*"

    # query = f"SELECT TOP 50 a.TDZL AS 土地坐落, a.XZQDM AS 行政区代码, a.SZX AS 所在县市区, a.SZXZ AS 所在乡镇, a.SZC AS 所在村, a.TDSYQR AS 土地使用权人, a.YDDW AS 用地单位名称, a.QSXZ AS 权属性质, a.SYQLX AS 使用权类型, a.PZYT AS 批准用途, a.GHYT AS 规划用途, a.TDMJ AS 土地面积, a.PZMJ AS 批准面积, a.GYMJ AS 供应面积, a.YJCMJ AS 已建成面积, a.JSZK AS 建设状况, a.JZMJ AS 建筑面积, a.JZJDMJ AS 建筑基底面积, a.RJL AS 容积率, a.JZMD AS 建筑密度, a.SFGSQYYD AS 是否规上企业用地, a.SFYDDQ AS 是否一地多企, a.DJGDZCTZ AS 地均固定资产投资, a.DJCZ AS 地均产值, a.DJXSSR AS 地均销售收入, a.DJSJSF AS 地均上缴税费, a.DJCYRY AS 地均从业人员, a.YDLX AS 用地类型, a.YDXWFSSJ AS 用地行为发生时间, a.CZKFBJNMJ AS 城镇开发边界内面积, a.DKJZDJ AS 地块所在区域基准地价, a.TDZCJZ AS 土地资产价值基准地价, a.SFDXYD AS 是否低效用地, a.DXLB AS 低效类别, a.PHFS AS 盘活方式, a.SSSJ AS 实施时间, a.PHPQBH AS 盘活片区编号, a.PHPQMC AS 盘活片区名称, ROUND(a.TDMJ * 15, 3) AS 亩, COUNT(b.TBBM) AS 宗地数_宗, a.BZ AS 备注 FROM GYYD a LEFT JOIN QYWZ b ON b.TBBM = a.DKBM GROUP BY a.TDZL, a.XZQDM, a.SZX, a.SZXZ, a.SZC, a.TDSYQR, a.YDDW, a.QSXZ, a.SYQLX, a.PZYT, a.GHYT, a.TDMJ, a.PZMJ, a.GYMJ, a.YJCMJ, a.JSZK, a.JZMJ, a.JZJDMJ, a.RJL, a.JZMD, a.SFGSQYYD, a.SFYDDQ, a.DJGDZCTZ, a.DJCZ, a.DJXSSR, a.DJSJSF, a.DJCYRY, a.YDLX, a.YDXWFSSJ, a.CZKFBJNMJ, a.DKJZDJ, a.TDZCJZ, a.SFDXYD, a.DXLB, a.PHFS, a.SSSJ, a.PHPQBH, a.PHPQMC, a.BZ"
    query = f"SELECT {columns_str} FROM {table_name}"
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
    table_name = request.args.get('table_name')
    columns = request.args.getlist('columns')  # 通过GET参数获取列名列表

    data = query_table(table_name, columns)
    return jsonify(data)


# 将Shapefile文件转换为GeoJSON格式的函数
# :param shp_file_path: Shapefile文件的路径
# :return: GeoJSON格式的地图数据
def shp_to_geojson(shp_file_path):
    # 读取Shapefile文件
    reader = shapefile.Reader(shp_file_path,encoding='gbk')
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
