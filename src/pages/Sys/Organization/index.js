import React,{ Component } from 'react';


import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import List from './List';

@connect(({ sysorganization }) => ({
  pageKey: sysorganization.pageKey,
}))
class Ledger extends Component {
  componentDidMount() {
  }

  render() {
    const { pageKey } = this.props;
    return (
      <PageHeaderWrapper key={pageKey}>
        <div className="pageContainer">
          <List />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Ledger;
