/**
 *
 * ComponentPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Chart2 from 'components/Chart2';
import Card from 'components/Card';
// import Table from 'components/Table';
// import Layout from 'components/Layout';
// import Menu from 'components/Menu';
import Pager from 'components/Pager';
import Input from 'components/Input';
import Select from 'components/Select';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Label from 'components/Label';
import ErrorMsg from 'components/ErrorMsg';
import Tabs from 'components/Tabs';
import TabsWrapper from 'components/Tabs/Wrapper';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import FileUpload from 'components/FileUpload';
import Title from 'components/Title';
import Text from 'components/Text';
import TableList from 'components/TableList';
import TableListWrapper from 'components/TableList/Wrapper';
import ListContent from 'components/TableList/ListContent';
import ListContentDetail from 'components/TableList/ListContentDetail';
import Timeline from 'components/Timeline';

// import TimelineImage from 'components/Timeline/TimelineImage';
import TimelineHeader from 'components/Timeline/TimelineHeader';
import TimelineBody from 'components/Timeline/TimelineBody';
import Alert from 'components/Alert';
import RadioButton from 'components/RadioButton';
import SwitchToggle from 'components/SwitchToggle';
import IcoFont from 'react-icofont';
// import Image from 'components/Img';

import FlowWrapper from 'components/TabFlow/Wrapper';
import FlowList from 'components/TabFlow';

import { withTheme } from 'styled-components';

// import icon from 'assets/images/icons/user_primary.png';

import Form from 'components/Form';
import Chart from 'components/Chart';
import Theme from 'components/Chart/Theme';

import { modalToggler, alertToggler } from 'utils/commonHelper';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectComponentPage from './selectors';
import reducer from './reducer';
import saga from './saga';

export function ComponentPage(props) {
  useInjectReducer({ key: 'componentPage', reducer });
  useInjectSaga({ key: 'componentPage', saga });

  const x = props.theme;

  const dataTable = [
    { label: 'apple', y: 10 },
    { label: 'orange', y: 15 },
    { label: 'banana', y: 25 },
    { label: 'mango', y: 30 },
    { label: 'grape', y: 28 },
  ];
  const categories = [
    'Nov 1',
    'Nov 2',
    'Nov 3',
    'Nov 4',
    'Nov 5',
    'Nov 6',
    'Nov 7',
    'Nov 8',
  ];

  const series = [
    {
      name: 'Likes',
      data: [30, 40, 10, 50, 49, 10, 70, 91],
    },
  ];

  const series2 = [
    {
      name: 'Likes',
      data: [
        [1486684800000, 29],
        [1486771200000, 34],
        [1486857600000, 31],
        [1486944000000, 43],
        [1487030400000, 33],
        [1487116800000, 52],
      ],
    },
    {
      name: 'Retweet',
      data: [
        [1486684800000, 10],
        [1486771200000, 0],
        [1486857600000, 4],
        [1486944000000, 35],
        [1487030400000, 75],
        [1487116800000, 40],
      ],
    },
    {
      name: 'unlike',
      data: [
        [1486684800000, 5],
        [1486771200000, 5],
        [1486857600000, -5],
        [1486944000000, -5],
        [1487030400000, -5],
        [1487116800000, -5],
      ],
    },
  ];

  return (
    <div>
      <Helmet>
        <title>ComponentPage</title>
        <meta name="description" content="Description of ComponentPage" />
      </Helmet>
      <div>
        {/* <Menu /> */}
        <div className="row justify-content-center">
          <div className="col-3">
            <Pager className="pt-3" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <h1>Buttons</h1>
            <div className="mb-3">
              <Button>Default</Button>
            </div>
            <div className="mb-3">
              <Button secondary>Secondary</Button>
            </div>
            <div className="mb-3">
              <Button small className="mx-3">
                Small
              </Button>
              <Button small secondary>
                Small
              </Button>
            </div>
            <div className="mb-3 mr-3">
              <Button onClick={() => modalToggler('ModalDismissable')}>
                Modal with x Button
              </Button>
            </div>
            <div className="mb-3">
              <Button onClick={() => modalToggler('ModalSuccess')}>
                Modal Success
              </Button>
            </div>
            <div className="mb-3">
              <Button tertiary onClick={() => modalToggler('ModalSuccess')}>
                Tertiary
              </Button>
            </div>
          </div>
          <div className="col-md-4">
            <h1>Forms</h1>
            <div className="mb-3">
              <Input
                placeholder="Coin"
                name="search"
                id="search"
                text="search"
                coin="\ed12"
                type="text"
                indent="50"
                className="icon-font"
              />
              <ErrorMsg>Error</ErrorMsg>
            </div>
            <div className="mb-3">
              <Input disabled placeholder="Disabled" />
            </div>
            <div className="mb-3">
              <Label required>Image</Label>
              <FileUpload accept="image/*" label="Upload File" />
            </div>
            <div className="mb-3">
              <Label required>Select</Label>
              <Select>
                <option>sample</option>
              </Select>
            </div>
            <div className="mb-3">
              <Checkbox />
            </div>
            <div className="row mb-3">
              <RadioButton
                id="rb1"
                name="rb"
                for="rb1"
                text="Radio Button 1"
                value="1"
              />
              <RadioButton
                id="rb2"
                name="rb"
                for="rb2"
                text="Radio Button 2"
                value="2"
              />
              <RadioButton
                id="rb3"
                name="rb"
                for="rb3"
                text="Radio Button 3"
                value="3"
              />
            </div>
            <div className="row mb-3">
              Toggle this : &nbsp; <SwitchToggle value={1} />
            </div>
          </div>
          <div className="col-md-3">
            <h1>Icons</h1>
            <IcoFont
              className="text-danger"
              icon="icofont-trash"
              style={{
                fontSize: '1em',
                marginRight: '0.5rem',
              }}
            />
            <IcoFont
              className="text-danger"
              icon="icofont-plus-circle"
              style={{
                fontSize: '1em',
                marginRight: '0.5rem',
              }}
            />
            <IcoFont
              className="text-success"
              icon="icofont-check-circle"
              style={{
                fontSize: '1em',
                marginRight: '0.5rem',
              }}
            />
            <h1>Button Icons</h1>
            <Button icon="ef16" />
            <Button icon="ef29" />

            <h1 className="mt-3 mb-0">Title</h1>
            <Title>Sample Title Tag</Title>

            <h1 className="mt-3 mb-0">Fonts</h1>
            <div className="row">
              <div className="col">
                <Text text="fontXS" size={x.fontSize.xs} />
                <br />
                <Text text="fontSM" size={x.fontSize.sm} />
                <br />
                <Text text="fontMD" size={x.fontSize.md} />
                <br />
                <Text text="fontLG" size={x.fontSize.lg} />
                <br />
                <Text text="fontXL" size={x.fontSize.xl} />
                <br />
              </div>
              <div className="col">
                <Text text="primary" color={x.primary} />
                <br />
                <Text text="primaryDark" color={x.primaryDark} />
                <br />
                <Text text="primaryBlur" color={x.primaryBlur} />
                <br />
                <Text text="secondary" color={x.secondary} />
                <br />
                <Text text="secondaryDark" color={x.secondaryDark} />
                <br />
                <Text text="tertiary" color={x.tertiary} />
                <br />
                <Text text="tertiaryLight" color={x.tertiaryLight} />
                <br />
                <Text text="light" color={x.light} />
                <br />
                <Text text="dark" color={x.dark} />
                <br />
                <Text text="gray" color={x.gray} />
                <br />
                <Text text="grayDark" color={x.grayDark} />
                <br />
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center my-4">
          <div className="col-md-3 mb-3">
            <h3>Chat</h3>
            <div className="bubble-wrapper">
              <IcoFont icon="icofont-user-alt-3" />
              <div className="bubble text-justify">
                Congratulations! You are one of the lucky winners of our
                campaign! Please fill up the attached form and follow
                instructions to claim the prize. Thank you!
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="text-center col-md-4 mb-3">
            <Card title="Sample title">
              kasdjfksdajfklsdfjksdjfkslfdjlskfjklsjf
            </Card>
          </div>
        </div>
        <div className="col-12 mb-3">
          <h3>Tab</h3>
          <TabsWrapper>
            <Tabs
              id="flow1"
              className="active"
              label="TAB1"
              activeClassName="active"
            />
            <Tabs id="flow2" className="" label="TAB2" />
            <Tabs id="flow3" className="" label="TAB3" />
            <Tabs id="flow4" className="" label="TAB4" />
          </TabsWrapper>
        </div>
        <div className="col-12 text-center">
          <TableList header align="left">
            <ListContent>Date</ListContent>
            <ListContent>Type</ListContent>
            <ListContent>Amount</ListContent>
          </TableList>
          <TableList align="left">
            <ListContent>06-01-19</ListContent>
            <ListContent>BUY</ListContent>
            <ListContent>1000 USD</ListContent>
          </TableList>
          <TableList align="left">
            <ListContent>06-01-19</ListContent>
            <ListContent>BUY</ListContent>
            <ListContent>1000 USD</ListContent>
          </TableList>
          <TableList align="left">
            <ListContent>06-01-19</ListContent>
            <ListContent>BUY</ListContent>
            <ListContent>1000 USD</ListContent>
          </TableList>
          <TableList align="left">
            <ListContent>06-01-19</ListContent>
            <ListContent>BUY</ListContent>
            <ListContent>1000 USD</ListContent>
          </TableList>
          <TableList align="left">
            <ListContent>06-01-19</ListContent>
            <ListContent>BUY</ListContent>
            <ListContent>1000 USD</ListContent>
          </TableList>
        </div>
        <div>
          <Modal title="Sample Title" id="ModalDismissable" dismissable>
            <ModalToggler modalId="ModalDismissable" />
            <div className="text-center">
              <p>sample text sample text sample text sample text</p>
              <div className="mb-3">
                <Input placeholder="Enter Ammount" />
              </div>
              <div className="mb-3">
                <Input placeholder="Enter Bitcoin Address" />
              </div>
              <Button primary className="col-4" dataDismiss="modal">
                Confirm
              </Button>
            </div>
          </Modal>
          <Modal title="Sample Title" id="ModalSuccess">
            <ModalToggler modalId="ModalSuccess" />
            <div className="text-center">
              <p>Your balance will update shortly.</p>
            </div>
          </Modal>
        </div>

        <div className="my-3">
          <h1>Alert</h1>
          <div>
            <Alert
              id="addSuccess"
              autoClose
              className="mb-3 alert-success fade hide show "
            >
              Pair has been Successfully Added!
            </Alert>
            <Alert id="editDanger" className="mb-3 alert-danger fade hide show">
              Close!!!
            </Alert>
            <Alert id="notif" className="mb-3 alert alert-secondary">
              <p className="d-inline">
                A new content of this website is available, please refresh the
                page to update or click the reload button.{' '}
              </p>
              <Button
                secondary
                className="col-2 mr-auto d-inline ml-4"
                dataDismiss="modal"
              >
                Reload
              </Button>
            </Alert>
            <Alert
              networkErrorLog
              id="errorLog"
              className="mb-3 alert alert alert-danger"
            >
              <div>
                <Label>Request</Label>
                <p className="pl-4">Request Content</p>
              </div>
              <hr />
              <div>
                <Label>Response</Label>
                <p className="pl-4">Request Content</p>
              </div>
            </Alert>
          </div>
          <Button
            icon="efc2"
            onClick={() => alertToggler('addSuccess', true)}
          />
          <Button
            icon="eee4"
            className="text-danger"
            onClick={() => alertToggler('editDanger', false)}
          />
          <Button link onClick={() => alertToggler('notif', false)}>
            Reload Alert
          </Button>
        </div>

        {/* table form */}
        <div className="my-5">
          <h1>TABLE LIST</h1>
          <Card
            title="CAMPAIGN A DETAILS"
            subTitle={
              <React.Fragment>
                STATUS:{' '}
                <span className="text-success font-weight-bold">ON-GOING</span>
              </React.Fragment>
            }
            component={
              <div className="row align-items-center justify-content-end">
                <div className="text-uppercase col-6 col-lg-4">
                  <Button red small className="text-uppercase">
                    force stop
                  </Button>
                </div>
                <div className="col-6 col-lg-4">
                  <Button small className="text-uppercase">
                    edit
                  </Button>
                </div>
              </div>
            }
          >
            <div className="col-12">
              <div className="row my-5">
                <div className="col-12 col-lg-4">
                  <Input
                    placeholder="Search"
                    className="icon-font"
                    coin="\ed12"
                  />
                </div>
                <div className="col-12 col-lg-4 d-flex align-items-center">
                  <Text className="col-3 pl-0 text-right" text="Filter 1:" />
                  <Select className="col-9">
                    <option>filter1</option>
                    <option>filter2</option>
                  </Select>
                </div>
                <div className="col-12 col-lg-4 d-flex align-items-center">
                  <Text className="col-3 pl-0 text-right" text="Filter 2:" />
                  <Select className="col-9">
                    <option>filter1</option>
                    <option>filter2</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <TableList header align="left">
                <ListContent width="5" />
                <ListContent>Date</ListContent>
                <ListContent>Pair</ListContent>
                <ListContent>Type</ListContent>
                <ListContent>Total</ListContent>
                <ListContent>Status</ListContent>
                <ListContent width="10">Actions</ListContent>
              </TableList>
              <TableListWrapper>
                <TableList align="left" index="1" toggleDetail>
                  <ListContent>
                    <Text text="2019-08-08" />
                  </ListContent>
                  <ListContent>
                    <Text text="BNB" /> / <Text text="USD" />
                  </ListContent>
                  <ListContent>
                    <Text text="Buy" />
                  </ListContent>
                  <ListContent>
                    <Text text="$100" />
                  </ListContent>
                  <ListContent>
                    <Label status="canceled">
                      CanceledCanceledCanceledCanceledCanceledCanceledCanceled
                    </Label>
                  </ListContent>
                  <ListContent width="10">
                    <div className="d-inline-flex">
                      <div className="">
                        <Button icon="ec4f" />
                      </div>
                    </div>
                  </ListContent>
                </TableList>
                <ListContentDetail id="1" className="hidden">
                  <Text
                    className="font-weight-bold text-uppercase"
                    color={x.dark}
                    size={x.fontSize.sm}
                    text="Details"
                  />
                  <div className="row">
                    <div className="col">
                      <div>
                        <span className="font-weight-bold">Side:</span> Sample{' '}
                      </div>
                      <div>
                        <span className="font-weight-bold">Price:</span> 1.01000{' '}
                      </div>
                      <div>
                        <span className="font-weight-bold">Amount:</span> 100${' '}
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        <span className="font-weight-bold">Filled:</span> 100${' '}
                      </div>
                      <div>
                        <span className="font-weight-bold">
                          Trigger Conditions:
                        </span>{' '}
                        100${' '}
                      </div>
                    </div>
                  </div>
                </ListContentDetail>
              </TableListWrapper>
              <TableListWrapper>
                <TableList align="left" index="2" toggleDetail>
                  <ListContent>
                    <Text text="2019-09-08" />
                  </ListContent>
                  <ListContent>
                    <Text text="BTC" /> / <Text text="EUR" />
                  </ListContent>
                  <ListContent>
                    <Text text="Sell" />
                  </ListContent>
                  <ListContent>
                    <Text text="$100" />
                  </ListContent>
                  <ListContent>
                    <Label status="pending">Pending</Label>
                  </ListContent>
                  <ListContent width="10">
                    <div className="d-inline-flex">
                      <div className="">
                        <Button icon="ec4f" />
                      </div>
                    </div>
                  </ListContent>
                </TableList>
                <ListContentDetail id="2" className="hidden">
                  <Text
                    className="font-weight-bold text-uppercase"
                    color={x.dark}
                    size={x.fontSize.sm}
                    text="Details"
                  />
                  <div className="row">
                    <div className="col">
                      <div>
                        <span className="font-weight-bold">Side:</span> Sample{' '}
                      </div>
                      <div>
                        <span className="font-weight-bold">Price:</span> 1.01000{' '}
                      </div>
                      <div>
                        <span className="font-weight-bold">Amount:</span> 100${' '}
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        <span className="font-weight-bold">Filled:</span> 100${' '}
                      </div>
                      <div>
                        <span className="font-weight-bold">
                          Trigger Conditions:
                        </span>{' '}
                        100${' '}
                      </div>
                    </div>
                  </div>
                </ListContentDetail>
              </TableListWrapper>
            </div>
          </Card>
        </div>
        {/* timeline */}
        <div className="mt-5">
          <h1>Timeline</h1>
          <Timeline>
            <li className="event" data-date="1:00">
              <TimelineHeader>Title 1</TimelineHeader>
              <TimelineBody>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </TimelineBody>
            </li>
            <li className="event" data-date="4:00">
              <TimelineBody>Lorem Ipsum is simply dummy text.</TimelineBody>
            </li>
            <li className="event" data-date="21:00">
              <TimelineBody>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </TimelineBody>
            </li>
            <li className="event" data-date="23:00">
              <TimelineBody>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum.
              </TimelineBody>
            </li>
          </Timeline>
        </div>
        <div className="mt-5">
          <h1>Charts</h1>
          <div className="row">
            <div className="col">
              <Card>
                <Chart
                  id="chart1"
                  height={200}
                  data={{
                    dataPoints: dataTable,
                    noIndexLabel: true,
                    type: 'column',
                  }}
                  theme={Theme.default}
                  axisX={{ noLabel: true }}
                  axisY={{ noLabel: true }}
                  title="Column Chart"
                  paletteSet={Theme.colorSet1}
                />
              </Card>
            </div>
            <div className="col">
              <Card>
                <Chart
                  id="chart2"
                  height={200}
                  data={{
                    dataPoints: dataTable,
                    noIndexLabel: true,
                    type: 'bar',
                  }}
                  theme={Theme.default}
                  axisX={{ noLabel: true }}
                  axisY={{ noLabel: true }}
                  title="Bar Chart"
                  paletteSet={Theme.colorSet1}
                />
              </Card>
            </div>
            <div className="col">
              <Card>
                <Chart
                  id="chart3"
                  height={200}
                  data={{
                    dataPoints: dataTable,
                    noIndexLabel: true,
                    type: 'line',
                  }}
                  theme={Theme.default}
                  axisX={{ noLabel: true }}
                  axisY={{ noLabel: true }}
                  title="Line Chart"
                  paletteSet={Theme.colorSet1}
                />
              </Card>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col">
              <Card>
                <Chart
                  id="chart4"
                  height={200}
                  theme={Theme.default}
                  axisX={{ noLabel: true }}
                  axisY={{ noLabel: true }}
                  data={{
                    dataPoints: dataTable,
                    noIndexLabel: true,
                    type: 'doughnut',
                  }}
                  title="Doughnut Chart"
                  paletteSet={Theme.colorSet1}
                />
              </Card>
            </div>
            <div className="col">
              <Card>
                <Chart
                  id="chart5"
                  height={200}
                  data={{
                    dataPoints: dataTable,
                    noIndexLabel: true,
                    type: 'pie',
                  }}
                  theme={Theme.default}
                  axisX={{ noLabel: true }}
                  axisY={{ noLabel: true }}
                  title="Pie Chart"
                  paletteSet={Theme.colorSet1}
                />
              </Card>
            </div>
            <div className="col-4">
              <Card>
                <Chart
                  id="chart6"
                  width={545}
                  height={200}
                  data={{
                    dataPoints: dataTable,
                    noIndexLabel: true,
                    type: 'area',
                  }}
                  theme={Theme.default}
                  axisX={{ noLabel: true }}
                  axisY={{ noLabel: true }}
                  title="Area Chart"
                  paletteSet={Theme.colorSet1}
                />
              </Card>
            </div>
          </div>
        </div>
        <div className="mt-5 col-12 mx-auto">
          <div className="row">
            <div className="col-4">
              <Chart2 chartType="line" cate={categories} series={series} />
            </div>
            <div className="col-4">
              <Chart2
                chartType="area"
                series={series2}
                axisType="datetime"
                showDataLabel
              />
            </div>
            <div className="col-4">
              <Chart2
                chartType="bar"
                series={series2}
                axisType="datetime"
                isStacked
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Form className="col-6">
            <div className="title">FORMS</div>
            <div className="row">
              <div className="col-5 label">Winner Template</div>
              <div className="col content">Campaign 01 Winner</div>
            </div>
            <div className="row">
              <div className="col-5 label">Loser Template</div>
              <div className="col content">Campaign 01 Winner</div>
            </div>
            <div className="row">
              <div className="col-5 label">Thank you Template</div>
              <div className="col content">Campaign 01 Template</div>
            </div>
            <div className="row">
              <div className="col-5 label">Form</div>
              <div className="col content">Campaign 01 Template</div>
            </div>
            <div className="row">
              <div className="col-5 label">Input Fields</div>
              <div className="col content">
                Name, Email, Contact No., Address
              </div>
            </div>
          </Form>
        </div>
        <div className="mt-5 d-block">
          <h1>Flow Tabs</h1>
          <div className="col-md-10 mx-auto">
            <FlowWrapper>
              <FlowList
                id="DownloadApp"
                label="Download App"
                // className={activeTab === 1 ? 'active' : ''}
                // onClick={() => props.changeActiveTab(1)}
              />
              <FlowList
                id="ScanQRCode"
                label="Scan QR Code"
                // className={activeTab === 2 ? 'active' : ''}
                // onClick={() => props.changeActiveTab(2)}
              />
              <FlowList
                id="BackupKey"
                label="Backup Key"
                // className={activeTab === 3 ? 'active' : ''}
                // onClick={() => props.changeActiveTab(3)}
              />
              <FlowList
                id="EnableGoogleAuth"
                label="Enable Google Authenticator"
                // className={activeTab === 4 ? 'active' : ''}
                // onClick={() => props.changeActiveTab(4)}
              />
            </FlowWrapper>
            <div className="col-md-12">test</div>
            <Alert />
          </div>
        </div>
      </div>
    </div>
  );
}

ComponentPage.propTypes = {
  theme: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  componentPage: makeSelectComponentPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  withTheme,
)(ComponentPage);
