
Scripts to parse data required for cancer browser

# Cell Line data

Current process for creating cell line data:

*Acquire XLS file from Google Drive*

*Export first sheet as CSV*

*Ensure unix style new lines*

Currently, this is done manually.

* Open CSV in TextWrangler
* Save as...
* Modify new line character to use.

*Run parse_cell_lines.js*

The latest downloaded CSV is stored in `tools/cell_lines.csv`.

Run `parse_cell_lines.js` on that file:

```
cd tools
./parse_cell_lines.js cell_lines.csv
```

The output will be `cell_lines.json` in the `tools` directory

*Run add_datasets_to_cell_lines.js*

This will append dataset values to the cell_lines.json and re-write it.

```
./add_datasets_to_cell_lines.js ./cell_lines.json ../common/api/data/dataset_info.json
```

*Copy cell_lines.json to data directory*

```
cp ./cell_lines.json ../common/api/data/
```

*Done*


All this is encapsulated in the `Makefile`

```
make all
```
