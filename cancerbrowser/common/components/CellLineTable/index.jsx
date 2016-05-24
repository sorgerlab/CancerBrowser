import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Column, Cell, ColumnGroup} from 'fixed-data-table';

const cellLines = [
  {
    'CellLine': '184B5',
    'ReceptorStatus': 'NM',
    'MolecularSubtype': 'Basal',
    'ClaudinStatus': '',
    'BRCA1': 'NA',
    'BRCA2': 'NA',
    'CDH1': 'NA',
    'MAP3K1': 'NA',
    'MLL3': 'NA',
    'PIK3CA': 'NA',
    'PTEN': 'NA',
    'TP53': 'NA',
    'GATA3': 'NA',
    'MAP2K4': 'NA'
  },
  {
    'CellLine': 'AU-565',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'BT-20',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'MUT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'BT-474',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'MUT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'BT-483',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'MUT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'BT-549',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': 'low',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'CAMA-1',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'MUT',
    'MAP3K1': 'MUT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'MUT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'DU4475',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'NA',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC38',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': 'low',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC70',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'MUT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC202',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1187',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1395',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': 'low',
    'BRCA1': 'MUT',
    'BRCA2': 'MUT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1419',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1428',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1500',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1569',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'MUT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'MUT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1599',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'MUT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1806',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1937',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'MUT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'MUT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC1954',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC2157',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'HCC2218',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'Hs 578T',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': 'low',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MCF7',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'MUT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MCF 10A',
    'ReceptorStatus': 'NM',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': '',
    'BRCA1': 'NA',
    'BRCA2': 'NA',
    'CDH1': 'NA',
    'MAP3K1': 'NA',
    'MLL3': 'NA',
    'PIK3CA': 'NA',
    'PTEN': 'NA',
    'TP53': 'NA',
    'GATA3': 'NA',
    'MAP2K4': 'NA'
  },
  {
    'CellLine': 'MCF 10F',
    'ReceptorStatus': 'NM',
    'MolecularSubtype': 'NA',
    'ClaudinStatus': '',
    'BRCA1': 'NA',
    'BRCA2': 'NA',
    'CDH1': 'NA',
    'MAP3K1': 'NA',
    'MLL3': 'NA',
    'PIK3CA': 'NA',
    'PTEN': 'NA',
    'TP53': 'NA',
    'GATA3': 'NA',
    'MAP2K4': 'NA'
  },
  {
    'CellLine': 'MCF-12A',
    'ReceptorStatus': 'NM',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': '',
    'BRCA1': 'NA',
    'BRCA2': 'NA',
    'CDH1': 'NA',
    'MAP3K1': 'NA',
    'MLL3': 'NA',
    'PIK3CA': 'NA',
    'PTEN': 'NA',
    'TP53': 'NA',
    'GATA3': 'NA',
    'MAP2K4': 'NA'
  },
  {
    'CellLine': 'MDA-MB-134-VI',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'MUT'
  },
  {
    'CellLine': 'MDA-MB-157',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': 'low',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'MUT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MDA-MB-175-VII',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MDA-MB-231',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': 'low',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MDA-MB-361',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'MUT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MDA-MB-415',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'MUT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'MUT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'MUT'
  },
  {
    'CellLine': 'MDA-MB-436',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal B',
    'ClaudinStatus': 'low',
    'BRCA1': 'MUT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MDA-MB-453',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'MUT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'MUT',
    'PTEN': 'MUT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'MDA-MB-468',
    'ReceptorStatus': 'TNBC',
    'MolecularSubtype': 'Basal A',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'MUT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'SK-BR-3',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'T47D',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'UACC-812',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'MUT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'UACC-893',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'MUT',
    'PTEN': 'WT',
    'TP53': 'MUT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'ZR-75-1',
    'ReceptorStatus': 'HR+',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'WT',
    'CDH1': 'WT',
    'MAP3K1': 'WT',
    'MLL3': 'WT',
    'PIK3CA': 'WT',
    'PTEN': 'MUT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  },
  {
    'CellLine': 'ZR-75-30',
    'ReceptorStatus': 'HER2amp',
    'MolecularSubtype': 'Luminal',
    'ClaudinStatus': '',
    'BRCA1': 'WT',
    'BRCA2': 'MUT',
    'CDH1': 'MUT',
    'MAP3K1': 'WT',
    'MLL3': 'MUT',
    'PIK3CA': 'WT',
    'PTEN': 'WT',
    'TP53': 'WT',
    'GATA3': 'WT',
    'MAP2K4': 'WT'
  }
];

const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

console.log('cell lines are', cellLines);

const propTypes = {
};


/** A way to render options in react-select that includes a bar and count */
class CellLineTable extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  cellLineColumn(data) {
    return (
      <Column
        key='cell-line'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].CellLine}</Cell>
        )}
        header={<Cell>Cell Line</Cell>}
        width={150} />
    );
  }

  receptorStatusColumn(data) {
    return (
      <Column
        key='receptor-status'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].ReceptorStatus}</Cell>
        )}
        header={<Cell>Receptor Status</Cell>}
        width={150} />
    );
  }

  molecularSubtypeColumn(data) {
    return (
      <Column
        key='molecular-subtype'
        cell={props => (
          <Cell {...props}>{data[props.rowIndex].MolecularSubtype}</Cell>
        )}
        header={<Cell>Molecular Subtype</Cell>}
        width={200} />
    );
  }

  mutationStatusColumn(data, gene) {
    return (
      <Column
        key={gene}
        cell={props => (
          <Cell {...props}>{data[props.rowIndex][`${gene}`]}</Cell>
        )}
        header={<Cell>{gene}</Cell>}
        width={80} />
    );
  }

  mutationStatusColumns(data) {
    return (
      <ColumnGroup
        key={'mutation-status'}
        header={<Cell>Mutation Status</Cell>}>
        {mutationGenes.map(gene => this.mutationStatusColumn(data, gene))}
      </ColumnGroup>
    );
  }

  summaryViewColumns(data) {
    return [(
      <ColumnGroup key={'non-mutation'}>
        {this.cellLineColumn(data)}
        {this.receptorStatusColumn(data)}
        {this.molecularSubtypeColumn(data)}
      </ColumnGroup>),
      this.mutationStatusColumns(data)
    ];
  }

  render() {
    const data = cellLines;

    return (
      <Table
        className="CellLineTable"
        rowsCount={data.length}
        rowHeight={40}
        headerHeight={40}
        groupHeaderHeight={40}
        width={1600}
        height={1000}>
        {this.summaryViewColumns(data)}

      </Table>
    );
  }
}

CellLineTable.propTypes = propTypes;

export default CellLineTable;
