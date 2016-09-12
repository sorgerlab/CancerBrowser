import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';

import { toList } from '../../utils/string_utils';

import PageLayout from '../../components/PageLayout';
import InfoPanel from '../../components/InfoPanel';
import { drugImageUrl } from '../../components/DrugCard';

import {
  fetchDrugInfoIfNeeded
} from '../../actions/drug';

import {
  getDrug
} from '../../selectors/drug';

import './drug_detail_page.scss';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  drugInfo: React.PropTypes.object
};

function mapStateToProps(state, ownProps) {

  const drug = getDrug(state, ownProps);
  return {
    drugInfo: drug
  };
}

function hmslincsDrugLink(drug) {
  const id = drug.hmsLincsId;
  return (
    <a href={`http://lincs.hms.harvard.edu/db/sm/${id}`}>{id}</a>
  );
}


function targetInfo(drug, property, doLink) {
  doLink = doLink === undefined ? true : doLink;
  let content;
  const info = drug[property];
  if (info) {
    const url = `/drugs?drugFilters[0][id]=${property}&drugFilters[0][values][0]=${info.value}`;
    content = info.label;
    if (doLink) {
      content = <Link to={url}>{content}</Link>;
    }
  } else {
    content = <em>Unknown</em>;
  }
  return content;
}
/**
 * Container component for contents of Company page content.
 */
class DrugDetailPage extends React.Component {

  /**
   * Render info panel component with drug info.
   */
  renderInfo(drugInfo) {
    const { developmentStage, synonyms } = drugInfo;
    const details = [
      { label: 'Development Stage',
        value: developmentStage ? developmentStage.label : <em>Unknown</em> },
      { label: 'Synonyms',
        value: synonyms.length ? toList(synonyms) : <em>None known</em> },
      { label: 'HMS LINCS ID',
        value: hmslincsDrugLink(drugInfo) }
    ];
    return (
      <InfoPanel details={details} />
    );
  }

  /**
   * Render info panel component with target info.
   */
  renderTarget(drugInfo) {
    const details = [
      { label: 'Gene', value: targetInfo(drugInfo, 'targetGene') },
      { label: 'Gene class', value: targetInfo(drugInfo, 'targetRole') },
      { label: 'Pathway', value: targetInfo(drugInfo, 'targetPathway') },
      { label: 'Biological function', value: targetInfo(drugInfo, 'targetFunction') },
      { label: 'Protein', value: targetInfo(drugInfo, 'targetProtein', false) },
      { label: 'Protein class', value: targetInfo(drugInfo, 'targetProteinClass', false) }
    ];
    return (
      <InfoPanel details={details} />
    );
  }


  /**
   * Renders list of associated datasets for clicking
   */
  renderDatasets(drugInfo) {
    const links = drugInfo.dataset.map((dataset) => {
      return <Link to={`/dataset/${dataset.value}/${drugInfo.id}/drug`} className="" >{dataset.label}</Link>;
    });

    return (
      <ul className="datasets">
        {links.map((link, index) => <li key={index}>{link}</li>)}
      </ul>
    );
  }

  /**
   * Render out JSX for DrugDetailPage.
   * @return {ReactElement} JSX markup.
   */
  render() {

    const { drugInfo } = this.props;


    if(drugInfo) {

      return (
        <PageLayout className='DrugDetailPage'>
          <Row>
            <Col lg={12}>
              <h1 className='name'>{ drugInfo.name ? drugInfo.name.label : '' }</h1>
            </Col>
          </Row>
          <Row>
            <Col md={3} lg={3}>
              <img className="structure" src={drugImageUrl(drugInfo)} />
            </Col>
            <Col md={9}>
              <Row>
                <Col md={6} lg={4}>
                  <h3>General Information</h3>
                  {this.renderInfo(drugInfo)}
                </Col>
                <Col md={6} lg={4}>
                  <h3>Target Information</h3>
                  {this.renderTarget(drugInfo)}
                </Col>
                <Col md={6} lg={4}>
                  <h3>Relevant Datasets</h3>
                  {this.renderDatasets(drugInfo)}
                </Col>
              </Row>
            </Col>
          </Row>
        </PageLayout>
      );
    } else {
      return(
        <PageLayout className="DrugDetailPage">
        </PageLayout>
      );
    }
  }
}

DrugDetailPage.propTypes = propTypes;

export default connect(mapStateToProps)(DrugDetailPage);
