import React from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';
import d3 from 'd3';

import './cell_line_glyph.scss';

// TODO: get this from the shared location
const mutationGenes = ['BRCA1', 'BRCA2', 'CDH1', 'MAP3K1', 'MLL3', 'PIK3CA', 'PTEN', 'TP53', 'GATA3', 'MAP2K4'];

const propTypes = {
  // the cell line definition
  cellLine: React.PropTypes.object.isRequired
};

/**
 * Componet to display interactive Cell Line Glyph.
 */
class CellLineGlyph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.renderGene = this.renderGene.bind(this);
    this.renderHighlight = this.renderHighlight.bind(this);
    this.visComponents = this.visComponents.bind(this);
  }

  /**
   * Configure all the dimensions and settings for the glyph
   *
   * @return {Object} An object with a key for each setting
   */
  visComponents() {
    if (this.cachedVisComponents) {
      return this.cachedVisComponents;
    }

    // each gene will take up geneWidth pixels
    const geneWidth = 16;

    // define the dimensions of the glyph
    const innerMargin = { top: 8, right: 8, bottom: 8, left: 8 };
    const width = geneWidth * mutationGenes.length + innerMargin.left + innerMargin.right;
    const height = 50;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;
    const innerWidth = width - innerMargin.left - innerMargin.right;

    // the x positioning scale for each gene
    const xScale = d3.scale.ordinal()
      .domain(mutationGenes)
      .range(d3.range(0, geneWidth * mutationGenes.length, geneWidth));

    // how much space to reserve for the letter
    const letterHeight = 15;

    // give the remaining height to the line
    const maxLineHeight = innerHeight - letterHeight;
    const lineHeights = {
      'WT':   Math.ceil(maxLineHeight * 0.4),
      'WT*':  Math.ceil(maxLineHeight * 0.4),
      'MUT':  maxLineHeight,
      'MUT*': maxLineHeight,
      'No data': 1
    };

    // ensure we have even lengths
    Object.keys(lineHeights).forEach(key => {
      if (key !== 'No data' && lineHeights[key] % 2 !== 0) {
        lineHeights[key] -= 1;
      }
    });

    this.cachedVisComponents = {
      width,
      height,
      innerHeight,
      innerWidth,
      innerMargin,
      geneWidth,
      xScale,
      lineHeights,
      letterHeight,
      maxLineHeight
    };

    return this.cachedVisComponents;
  }

  /**
   * Life cycle method to check if component needs to be updated
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * On hover, store the gene hovered on in state as `highlightGene`
   * @param {String} gene id of gene.
   */
  handleHoverGene(gene) {
    this.setState({ highlightGene: gene });
  }

  /**
   * Renders the full gene name and the receptor status label on hover
   *
   * @return {React.Component}
   */
  renderHighlight() {
    const { cellLine } = this.props;
    const { letterHeight, innerWidth, maxLineHeight } = this.visComponents();
    const { highlightGene } = this.state;

    if (!highlightGene) {
      return null;
    }

    const geneType = cellLine[highlightGene];

    return (
      <g className='highlight' transform={`translate(0 ${maxLineHeight})`}>
        <rect x={0} y={0} width={innerWidth} height={letterHeight} fill='#fff' />
        <text className='gene-name' x={0} y={letterHeight} textAnchor='start'>
          {highlightGene}
          <tspan dx={5} className={classNames({ 'no-data': geneType === 'No data' })}>
            {` ${geneType}`}
          </tspan>
        </text>
        <text className='receptor-status-label' x={innerWidth} y={letterHeight} textAnchor='end'>
          {cellLine.receptorStatus.label}
        </text>
      </g>
    );
  }

  /**
   * Renders a gene line and letter
   *
   * @param {String} gene The gene being rendered (e.g., 'BRCA1')
   * @param {String|Number} key The react key of the rendered root element
   * @return {React.Component}
   */
  renderGene(gene, key) {
    const { cellLine } = this.props;
    const { geneWidth, lineHeights, letterHeight, innerHeight,
      maxLineHeight, xScale } = this.visComponents();
    const { highlightGene } = this.state;

    const isHighlighted = gene === highlightGene;

    // what type of mutation does this gene have (MUT, WT, etc.)
    const geneType = cellLine[gene];
    const isMutated = geneType === 'MUT' || geneType === 'MUT*';

    // the x position
    const x = xScale(gene) + geneWidth / 2;

    // how high to make the glyph line depending on the gene type (MUT, WT, etc.)
    const lineHeight = lineHeights[geneType];

    // draw vertical lines unless no data, then draw a small horizontal dash
    let x1 = 0, x2 = 0, y1 = -lineHeight / 2, y2 = lineHeight / 2;
    if (geneType === 'No data') {
      x1 = -2;
      x2 = 2;
      y1 = 0;
      y2 = 0;
    }

    return (
      <g key={key} transform={`translate(${x} 0)`}
          className={classNames({ highlighted: isHighlighted, 'not-highlighted': !isHighlighted })}>
        <rect x={-geneWidth / 2} y={0} /* mouse handler rect */
          width={geneWidth} height={innerHeight} fill='#fff'
          onMouseEnter={this.handleHoverGene.bind(this, gene)}
          onMouseLeave={this.handleHoverGene.bind(this, null)} />
        <line
            className={classNames({ mutation: isMutated })}
            x1={x1} x2={x2} y1={y1} y2={y2}
            transform={`translate(0 ${maxLineHeight / 2})`} />
        <text className='gene-letter' x={0} y={maxLineHeight + letterHeight}
            textAnchor='middle'>{gene.charAt(0)}</text>
      </g>
    );
  }

  /**
   * Main render method.
   */
  render() {
    const { cellLine } = this.props;
    const { width, height, innerMargin } = this.visComponents();
    const { highlightGene } = this.state;

    return (
      <svg className={classNames('CellLineGlyph', `receptor-status-${cellLine.receptorStatus.value}`,
            {'has-highlight': highlightGene })} width={width} height={height}>
        <g transform={`translate(${innerMargin.left} ${innerMargin.top})`}>
          {mutationGenes.map(this.renderGene)}
          {this.renderHighlight()}
        </g>
      </svg>
    );
  }
}

CellLineGlyph.propTypes = propTypes;

export default CellLineGlyph;
