import React, { Component } from 'react';

import connectToDatoCms from './connectToDatoCms';
import './style.scss';
import {getCategories} from "./cms";
import Publication from "./Publication";

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
}))

export default class Main extends Component {

  state = {
    fieldValue: {}
  };

  componentDidMount() {
    const { plugin } = this.props;
    plugin.addFieldChangeListener("publications", this.refresh);
    this.refresh();
  }

  refresh = () => {
    const { plugin } = this.props;
    const { token, draft } = plugin.parameters.global;
    const publicationIds = plugin.getFieldValue('publications');
    getCategories({draft, token, publicationIds}).then(result => {
      this.setState({publications: result.publications});
    });
    const rawFieldValue = plugin.getFieldValue('categories');
    const fieldValue = JSON.parse(rawFieldValue || "{}");
    publicationIds.forEach(id => {
      fieldValue[id] = fieldValue[id] || {}
    })
    this.setState({fieldValue});
  }

  onChangeCategories = (publicationId, categories) => {
    const { plugin } = this.props;
    const fieldValue = {
      ...this.state.fieldValue,
      [publicationId]: categories
    };
    this.setState({fieldValue});
    plugin.setFieldValue('categories', JSON.stringify(fieldValue));
  }

  render() {
    const publications = this.state.publications || [];

    return (
      <div className="container">
        {publications.map((p,i) => (<div key={i}>
          <h1>{p.title}</h1>
          <Publication
              label={"Category:"}
              categories={p.categories}
              onChange={(value) => this.onChangeCategories(p.id,value)}
              value={this.state.fieldValue[p.id]}
          />
        </div>))}
      </div>
    );
  }
}
