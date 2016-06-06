
cell_lines:
	./parse_cell_lines.js cell_lines.csv
	./add_datasets_to_cell_lines.js ./cell_lines.json ../common/api/data/dataset_info.json

move_cell_lines:
	mv cell_lines.json ../common/api/data/

drugs:
	./parse_drugs.js drugs.csv
	./add_datasets_to_drugs.js ./drugs.json ../common/api/data/dataset_info.json

move_drugs:
	mv drugs.json ../common/api/data/

all: cell_lines move_cell_lines drugs move_drugs

default: all
