
Scripts to parse data required for cancer browser

## Cell Line Data

Current process for creating cell line data:

*Acquire XLS file from Google Drive*

*Export first sheet as CSV*

*Ensure unix style new lines*

Currently, this is done manually.

* Open CSV in TextWrangler
* Save as...
* Modify new line character to use.

*Save as cell_lines.csv*

In the `tools/` sub-directory.

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

*Move cell_lines.json to data directory*

```
mv ./cell_lines.json ../common/api/data/
```

*Done*

## Drug Data

*Open Drug Google Sheet*

*Export first sheet as CSV*

*Ensure unix style new lines*

Currently, this is done manually.

* Open CSV in TextWrangler
* Save as...
* Modify new line character to use.

*Save as drugs.csv*

In the `tools/` sub-directory.

*Run parse_drugs.js*

The latest downloaded CSV is stored in `tools/drugs.csv`.

```
cd tools
./parse_drugs.js drugs.csv
```

*Move drugs.json to data directory*

```
mv ./drugs.json ../common/api/data/
```

*Done*

## Makefile


All the scriptable portions of this are encapsulated in the `Makefile`.

The expectation is that `cell_lines.csv` and `drugs.csv` are in the `tools`
sub-directory. Then just run:

```
make all
```
