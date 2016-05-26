
cell_lines:
	./parse_cell_lines.js cell_lines.csv
	./add_datasets_to_cell_lines.js ./cell_lines.json ../common/api/data/dataset_info.json

copy_cell_lines:
	cp cell_lines.json ../common/api/data/

all: cell_lines copy_cell_lines
