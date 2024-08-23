from flask import Flask, jsonify,request
import shapefile
import pyproj

app = Flask(__name__)

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
    app.run(debug=True)
