/* eslint-disable react/prop-types */
import React from 'react';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
// import Checkbox from 'components/Checkbox';
import Form from 'components/Form';
import Card from 'components/Card';
import Button from 'components/Button';
import Tweet from 'components/Tweet';
import Modal from 'components/Modal';
import ModalToggler from 'components/Modal/ModalToggler';
import TemplatePreview from 'components/TemplatePreview';
import PostTweet from 'components/PostTweet';
// import ErrorFormatted from 'components/ErrorFormatted';
import FormPreview from 'containers/FormPreviewPage';
import User from 'assets/images/icons/user_primary.png';
import { forwardTo } from 'helpers/forwardTo';
import { modalToggler } from 'utils/commonHelper';
import messages from '../messages';

const Modals = ({ intl, form, tempDetails, campaignId }) => {
  const {
    inputFormFields,
    inputFormFields2,
    inputFormFields3,
    formList,
    formDesign,
    formMessageTemplate,
    inputFormFieldsRequired,
  } = form;
  return (
    <>
      <Modal id="winTemplateModal" dismissable size="lg">
        <ModalToggler modalId="winTemplateModal" />
        <TemplatePreview content="Sample content" />
        <div className="row justify-content-center">
          <div className="col-auto">
            <Button
              secondary
              width="md"
              className="mr-2"
              dataDismiss="modal"
              onClick={() => modalToggler('updateTemplate')}
            >
              {intl.formatMessage(
                { id: 'T0000020' },
                { name: intl.formatMessage({ ...messages.template }) },
              )}
            </Button>
            <Button
              width="md"
              dataDismiss="modal"
              onClick={() => modalToggler('newTemplate')}
            >
              {intl.formatMessage(
                { id: 'T0000019' },
                { name: intl.formatMessage({ ...messages.template }) },
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal id="updateTemplate" dismissable size="lg">
        <ModalToggler modalId="updateTemplate" />
        <div className="row mb-3">
          <div className="col-4">
            <Label>Template Content</Label>
          </div>
          <div className="col-8">
            <PostTweet intl={intl} />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-auto">
            <Button secondary width="sm" className="mr-2">
              {intl.formatMessage({ ...messages.back })}
            </Button>
            <Button width="sm">
              {' '}
              {intl.formatMessage({ ...messages.save })}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal id="newTemplate" size="lg">
        <ModalToggler modalId="newTemplate" />
        <Form className="mb-3">
          <Card>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="templateName" required>
                  {intl.formatMessage({ ...messages.templateName })}
                </Label>
              </div>
              <div className="col-8">
                <Input id="templateName" name="templateName" />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="type" required>
                  {intl.formatMessage({ ...messages.type })}
                </Label>
              </div>
              <div className="col-8">
                <Select id="type" name="type">
                  <option>test</option>
                </Select>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="cate" required>
                  {intl.formatMessage({ ...messages.category })}
                </Label>
              </div>
              <div className="col-8">
                <Select id="cate" name="cate">
                  <option>test</option>
                </Select>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="desc">
                  {intl.formatMessage({ ...messages.description })}
                </Label>
              </div>
              <div className="col-8">
                <Input id="desc" name="desc" />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 py-0 label">
                <Label htmlFor="content" required>
                  {intl.formatMessage({ ...messages.templateContent })}
                </Label>
              </div>
              <div className="col-8">
                <PostTweet intl={intl} />
              </div>
            </div>
          </Card>
        </Form>
        <div className="row justify-content-center">
          <div className="col-auto">
            <Button secondary width="sm" className="mr-2" dataDismiss="modal">
              {intl.formatMessage({ ...messages.back })}
            </Button>
            <Button width="sm" dataDismiss="modal">
              {intl.formatMessage({ ...messages.save })}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal id="previewTemplateModal" size="md" dismissable>
        <ModalToggler modalId="previewTemplateModal" />
        {tempDetails && (
          <TemplatePreview
            content={tempDetails.content}
            uploadFiles={
              tempDetails.message_file ? [tempDetails.message_file] : []
            }
          />
        )}
      </Modal>

      <Modal id="formPreviewModal" size="md" dismissable>
        <ModalToggler modalId="formPreviewModal" />
        <FormPreview
          inputFormFields={inputFormFields}
          inputFormFields2={inputFormFields2}
          inputFormFields3={inputFormFields3}
          inputFormFieldsRequired={inputFormFieldsRequired.map(Number)}
          formDesign={formDesign}
          template={(formList || []).find(
            ({ id }) => id === Number(formMessageTemplate.value),
          )}
        />
      </Modal>
      <Modal id="postPreviewModal" size="md" dismissable>
        <ModalToggler modalId="postPreviewModal" />
        <Tweet
          userImg={User}
          name={tempDetails.content}
          content={tempDetails.content}
          dateTime="12/09/2018"
          onDelete={false}
        />
      </Modal>
      <Modal id="publishSuccess">
        <ModalToggler modalId="publishSuccess" />
        <div className="text-center">
          <p>
            {intl.formatMessage(
              { id: 'M0000003' },
              {
                name: intl.formatMessage(messages.campaign),
                status: intl.formatMessage(messages.published),
              },
            )}
            !
          </p>
          <div className="row mt-4 justify-content-center">
            <div className="col-4">
              <Button
                secondary
                dataDismiss="modal"
                onClick={() => forwardTo(`/campaign/detail/${campaignId}`)}
              >
                {intl.formatMessage({ ...messages.ok })}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Modals;
