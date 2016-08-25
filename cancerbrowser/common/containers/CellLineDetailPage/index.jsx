import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { toList } from '../../utils/string_utils';

import PageLayout from '../../components/PageLayout';
import CellLineGlyph from '../../components/CellLineGlyph';
import InfoPanel from '../../components/InfoPanel';

import './cell_line_detail_page.scss';

import {
  getCellLine
} from '../../selectors/cell_line';

const propTypes = {
  dispatch: React.PropTypes.func,
  cellLineInfo: React.PropTypes.object,
  params: React.PropTypes.object
};


function mapStateToProps(state, ownProps) {

  const cellLine = getCellLine(state, ownProps);
  return {
    cellLineInfo: cellLine
  };

}

/**
 * Cell Line Details Container Component
 */
class CellLineDetailPage extends React.Component {

  /**
   * Display general info
   */
  renderInfo(cellLine) {
    const details = [
      {label: 'Collections', value: toList(cellLine.collection, (s) => s.label)},
      {label: 'Receptor Status', value: cellLine.receptorStatus.label},
      {label: 'Molecular Subtype', value: cellLine.molecularSubtype.label}
    ];

    return (
      <InfoPanel details={details} />
    );
  }

  /**
   * Display Aux info
   */
  renderMediaInfo(cellLine) {
    const details = [
      {label: 'Media Base', value: cellLine.mediaBase.label},
      {label: 'Media Additives', value: cellLine.mediaAdditives.label},
      {label: 'ATCC Number', value: cellLine.atccNumber.label},
      {label: 'ATCC Link',
       value: <a target={"_blank"} href={cellLine.link.label}>{cellLine.cellLine.label}</a>}
    ];

    return (
      <InfoPanel details={details} />
    );
  }

  /**
   * Display list of datasets
   */
  renderDatasets(cellLine) {
    const links = cellLine.dataset.map((dataset) => {
      return <Link to={`/dataset/${dataset.value}/${cellLine.id}/cellLine`} className="" >{dataset.label}</Link>;
    });

    return (
      <ul className="datasets">
        {links.map((link, index) => <li key={index}>{link}</li>)}
      </ul>
    );

  }

  /**
   * Render out JSX for CellDetail.
   * @return {ReactElement} JSX markup.
   */
  render() {

    const cellLine = this.props.cellLineInfo;

    if(cellLine) {

      return (
        <PageLayout className='CellLineDetailPage'>
          <h1 className='name'>{ cellLine.cellLine.label }</h1>
          <div className='glyph'>
            <CellLineGlyph cellLine={cellLine} />
          </div>

          <div className='clearfix'></div>

          <h3>General Information</h3>
          {this.renderInfo(cellLine)}
          <h3>Media &amp; ATTC Information</h3>
          {this.renderMediaInfo(cellLine)}
          <h3>Dataset Displays</h3>
          {this.renderDatasets(cellLine)}
        </PageLayout>
      );
    } else {
      return(
        <PageLayout className="CellLineDetailPage">
        </PageLayout>
      );
    }
  }
}

CellLineDetailPage.propTypes = propTypes;

export default connect(mapStateToProps)(CellLineDetailPage);
