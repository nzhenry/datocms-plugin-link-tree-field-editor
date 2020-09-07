import React, {Component} from 'react';

import './style.scss';

export default class Publication extends Component {

  state = {};

  findCategory = (slug) => this.props.categories.find(c => c.slug === slug);

  onChange = (value) => {
    if(this.props.onChange) {
      this.props.onChange(value);
    }
  }

  onValueChange = (value) => {
    this.onChange([value]);
  }

  onSubValueChange = (value) => {
    this.onChange([
      this.props.value[0],
      ...value
    ]);
  }

  render() {
    const {categories} = this.props;
    const value = this.props.value || [];
    const selectedValue = value.length ? value[0] : '';
    const selectedCategory = this.findCategory(selectedValue);
    const subCategories = selectedCategory?.children || [];
    const selectedSubValues = value.length > 1 && value.slice(1);

    return (
        <div>
          <label>
            <span>{this.props.label}</span>
            <select
                value={selectedValue}
                onChange={(e) => this.onValueChange(e.target.value)}>
              <option value="" disabled>Select</option>
              {categories.map((c, i) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          {
            subCategories.length > 0 &&
            <Publication
                label={"Sub-category:"}
                categories={subCategories}
                onChange={this.onSubValueChange}
                value={selectedSubValues}
            />
          }
        </div>
    );
  }
}
