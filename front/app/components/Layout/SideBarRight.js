import React from 'react';
import PropTypes from 'prop-types';
import SideBarRight from 'components/SideBarRight';
import TabsWrapper from 'components/Tabs/Wrapper';
import Tabs from 'components/Tabs';
import Input from 'components/Input';
import Text from 'components/Text';

const SideBar = ({ activeTab, setActiveTab }) => (
  <SideBarRight>
    <div className="borderBottom mb-3">
      <TabsWrapper className="bottom">
        <Tabs
          id="flow1"
          className={activeTab === 1 ? 'active' : ''}
          label="Fee"
          onClick={() => setActiveTab(1)}
        />
        <Tabs
          id="flow2"
          className={activeTab === 2 ? 'active' : ''}
          label="Volume"
          onClick={() => setActiveTab(2)}
        />
        <Tabs
          id="flow3"
          className={activeTab === 3 ? 'active' : ''}
          label="Currency"
          onClick={() => setActiveTab(3)}
        />
      </TabsWrapper>
    </div>
    {activeTab === 1 && (
      <div className="p-3">
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 1" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 2" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 3" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 4" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 5" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 6" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 7" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 8" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 9" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 10" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
      </div>
    )}
    {activeTab === 2 && (
      <div className="p-3">
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Volume" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
      </div>
    )}
    {activeTab === 3 && (
      <div className="p-3">
        <div className="row mb-2 align-items-center">
          <div className="col-4">
            <Text text="Level 1" />
          </div>
          <div className="col">
            <Input placeholder="0.5" />
          </div>
        </div>
      </div>
    )}
  </SideBarRight>
);

SideBar.propTypes = {
  setActiveTab: PropTypes.func,
  activeTab: PropTypes.number,
};

export default SideBar;
