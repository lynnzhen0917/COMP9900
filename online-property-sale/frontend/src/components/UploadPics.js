
import React from 'react'
import { Upload, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

// refer to the upload component in antd

const FormItem = Form.Item;
function getBase64(file) {
    // transfer the file into base64 code
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
       
        reader.onerror = error => reject(error);
    });
}

export default class PictureWall extends React.Component {
    // used to preview the photos which have been uploaded
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: [],
        };
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        // console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
        // console.log(this.state.previewImage)
    };

    handleChange = async ({ fileList }) => {
        this.setState({ fileList })
        // let fileList = e.target.files;
        // console.log(fileList)
        for (var i = 0; i < fileList.length; i++) {
            let file = fileList[i];
            if (!file.url && !file.preview) {
                file.mybase64 = await getBase64(file.originFileObj);
            }
        }
        // this.setState({ fileList })
            
        this.props.onDone(fileList) ;
        // console.log(fileList)
    }
    
    beforeUpload = () => false;
    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 22 },
        };
        
        
        return (
            <>
                <div>
                    <FormItem {...formItemLayout}> 
                        <Upload
                            action="http://localhost:5050/newpost"
                            // action = ""
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            beforeUpload={this.beforeUpload}
                            multiple={ this.props.multiple }
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={this.handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </FormItem>
            </div>
                
            </>
        );
    }
}

PictureWall.defaultProps = {
    multiple: true,
};