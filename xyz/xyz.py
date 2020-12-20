# open the source file, read every line and split the lines
filename = "source.xyz"
# define the bounding box
xmin = "2683475.00"
ymin = "1242525.00"
xmax = "2683540.00"
ymax = "1242595.00"

#open the source file, read every line of the are in the bounding box and append the coordinates

col_num = 3
col_data = []
delimiter = ' '

with open(filename) as f:
                col_data.append(f.readline().split(delimiter)[col_num])

print col_data


