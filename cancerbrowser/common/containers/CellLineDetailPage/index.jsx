import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';

import { toList } from '../../utils/string_utils';

import PageLayout from '../../components/PageLayout';
import CellLineGlyph from '../../components/CellLineGlyph';
import InfoPanel from '../../components/InfoPanel';
import Figure from '../../components/Figure';

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

function omeroImageUrl(id, width) {
  return `https://lincs-omero.hms.harvard.edu/webclient/render_thumbnail/size/${width}/${id}/`;
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
   * Display images
   */
  renderImages(cellLine) {
    let figures;
    if (Object.keys(cellLine.omero_image_ids).length) {
      figures = [['4x', '10x'], ['20x', '40x']].map((pair) => {
        const rendered_pair = pair.map((magnification) => {
          const url = omeroImageUrl(cellLine.omero_image_ids[magnification], 300);
          return <Figure key={cellLine.id + magnification} caption={magnification}
                         width={300} imageUrl={url} />;
        });
        return <div className="pair">{ rendered_pair }</div>;
      });
    } else {
      figures = <p><em>Images are not available for this cell line.</em></p>;
    }

    return (
      <div className="images">{ figures }</div>
    );
  }

  /**
   * Display list of datasets
   */
  renderDatasets(cellLine) {
    const links = cellLine.dataset.map((dataset) => {
      return <Link to={`/dataset/${dataset.value}/${cellLine.id}/cellLine`}>{dataset.label}</Link>;
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
          <Row>
            <Col lg={12}>
              <h1 className='name'>{ cellLine.cellLine.label }</h1>
              <div className='glyph'>
                <CellLineGlyph cellLine={cellLine} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <h3>General Information</h3>
              {this.renderInfo(cellLine)}
            </Col>
            <Col lg={4}>
              <h3>Media &amp; ATCC Information</h3>
              {this.renderMediaInfo(cellLine)}
            </Col>
            <Col lg={4}>
              <h3>Relevant Datasets</h3>
              {this.renderDatasets(cellLine)}
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <h3>Images</h3>
              {this.renderImages(cellLine)}
            </Col>
          </Row>
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
