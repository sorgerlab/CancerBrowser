import React from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import './cell_line_glyph.scss';

// TODO: get this from the shared location
const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

const propTypes = {
  // the cell line definition
  cellLine: React.PropTypes.object.isRequired
};

class CellLineGlyph extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { cellLine } = this.props;

    const geneWidth = 16;
    const innerMargin = { top: 8, right: 8, bottom: 8, left: 8 };
    const width = geneWidth * mutationGenes.length + innerMargin.left + innerMargin.right;
    const height = 50;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;
    const innerWidth = width - innerMargin.left - innerMargin.right;

    const letterHeight = 20;
    const maxLineHeight = innerHeight - letterHeight;
    const lineHeights = {
      WT: maxLineHeight / 2,
      'WT*': maxLineHeight / 2,
      MUT: maxLineHeight,
      'MUT*': maxLineHeight,
      'No data': 1
    };

    return (
      <svg className={classNames('CellLineGlyph', `receptor-status-${cellLine.receptorStatus.value}`)}
          width={width} height={height}>
        <g transform={`translate(${innerMargin.left} ${innerMargin.top})`}>
          {mutationGenes.map((gene, i) => {
            const type = cellLine[gene];
            const x = i * geneWidth + geneWidth / 2;
            const lineHeight = lineHeights[type];

            let x1 = 0, x2 = 0, y1 = -lineHeight / 2, y2 = lineHeight;
            if (type === 'No data') {
              x1 = -2;
              x2 = 2;
              y1 = 0;
              y2 = 0;
            }

            return (
              <g transform={`translate(${x} 0)`}>
                <line key={i}
                    className={classNames({ mutation: type === 'MUT' || type === 'MUT*' })}
                    x1={x1} x2={x2} y1={y1} y2={y2}
                    transform={`translate(0 ${maxLineHeight / 2})`} />
                <text className='gene-letter' x={0} y={maxLineHeight + letterHeight}
                    textAnchor='middle'>{gene.charAt(0)}</text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
}

CellLineGlyph.propTypes = propTypes;

export default CellLineGlyph;
