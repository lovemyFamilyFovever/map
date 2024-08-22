
import os
import geopandas as gpd
 
# 定义输入和输出文件夹路径
input_folder = 'E:\chen\map\transformData'
output_folder = 'E:\chen\map\transformData'
 
# 定义输入和输出坐标系
out_proj = 'EPSG:3857'
 
# 获取输入文件夹下所有的 Shapefile 文件
shapefiles = [f for f in os.listdir(input_folder) if f.endswith('.shp')]
 
# 循环处理每个 Shapefile 文件
for index, shapefile in enumerate(shapefiles):
    print('转换第%d条数据...' % (index+1))
    # 读取 Shapefile 文件
    gdf = gpd.read_file(os.path.join(input_folder, shapefile))
 
    # 对几何数据进行坐标系转换
    gdf.to_crs(out_proj, inplace=True)
 
    # 构造输出文件名，将 '.shp' 替换为 '.geojson'
    output_file = os.path.splitext(shapefile)[0] + '.geojson'
 
    # 保存为 GeoJSON 文件
    gdf.to_file(os.path.join(output_folder, output_file), driver='GeoJSON')
 
print('Shapefile 转换为包含 EPSG:3857 坐标系的 GeoJSON 完成！')