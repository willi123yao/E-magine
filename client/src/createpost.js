import React, { Component } from 'react';
import env from './env.json';
import './DiscApp.css';
import './discindex.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Button } from 'antd';
import { Tabs, Icon, Divider, Input, Select, message, Upload } from 'antd';
import { useHistory } from 'react-router-dom';
const { TabPane } = Tabs;
const { Option } = Select;

var FormInput = [
    "",
    "",
    "",
]
var clicked = false
var token = "";

const props = {
    name: 'file',
    action: window.baseURL + '/v1/upload',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

function Redirect() { //Special hook function in order to use React Router's history.push 
    const history = useHistory();

    function HandleClick() {
        clicked = true
        fetch(window.baseURL + '/api/v1/channels', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify({
                "type": 0,
                "timestamp": Date.now(),
                "description": FormInput[0],
                "title": FormInput[1],
                "topic": FormInput[2]
            })
        }).then((results) => {
            return results.json(); //return data in JSON (since its JSON data)
        }).then((data) => {


            if (data.success === true) {
                message.success({ content: "Post successfully created with id " + data.id });
                history.push({ pathname: "/DiscApp/" + data.id });
            }
            else {
                message.error({ content: "Oops... Form fields cannot be left blank" });
            }

            clicked = false;

        }).catch((error) => {
            clicked = false;
            message.error({ content: "Oops, connection error" });
        })

    }

    return (
        <Button type='primary' onClick={HandleClick}>Post!</Button>
    );
}


export default class CreatePost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            fileName: '',
            post: '',
            user: 'Bob',
            title: '',
            topic: '',
            file: null,


        } //For storing text for post
        token = this.state.token
        this.tabcontainer = { color: "white", backgroundColor: "#001529", boxShadow: "3px 3px 10px #0a0a0a" }
    }
    changeText = (ev) => { let val = ev.target.value; let nam = ev.target.name; this.setState({ [nam]: val }) }


    componentDidMount() {
        var self = this;
        if (env.froala_key) {
            this.editor = new window.FroalaEditor('#createexampl', {
                events: {
                    contentChanged: function () {
                        self.setState({ post: this.html.get() });
                    },
                    initialized: function () {
                        this.html.set(self.state.post)
                    }
                },
                height: 250,
                attribution: false,
                key: env.froala_key
            })
        }
        else {
            this.editor = new window.FroalaEditor('#createexampl', {
                events: {
                    contentChanged: function () {
                        self.setState({ post: this.html.get() });
                    },
                    initialized: function () {
                        this.html.set(self.state.post)
                    }
                },
                height: 250,
                attribution: false
            })
        }
    }
    componentDidUpdate() {

        // create a variable to check if the thingy is open
        // if it is not and user is poster, create editor
        var self = this;
        if (env.froala_key) {
            this.editor = new window.FroalaEditor('#createexampl',
            {
                events: {
                    contentChanged: function () {
                        self.setState({ post: this.html.get() });
                    },
                    initialized: function () {
                        this.html.set(self.state.post)
                    }
                },
                attribution: false,
                key: env.froala_key
            })
        }
        else {
            this.editor = new window.FroalaEditor('#createexampl',
            {
                events: {
                    contentChanged: function () {
                        self.setState({ post: this.html.get() });
                    },
                    initialized: function () {
                        this.html.set(self.state.post)
                    }
                },
                attribution: false
            })
        }
        if (clicked === false) {
            FormInput[0] = this.state.post
            FormInput[1] = this.state.title
            FormInput[2] = this.state.topic
            console.log(FormInput)
        }

    }

    handleTitle(e) {
        this.setState({ title: e.target.value })
    }

    topicOnChange(e) {
        this.setState({ topic: e })
    }

    handleSubmit(event) {
        alert(this.state.value);
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
        console.log(this.state.value)
    }


    render() {
        let ifPosted = ''
        let d = new Date()
        if (this.state.postState === 'Edit!') {
            ifPosted = <p className='whiteright'>Posted by {this.state.user} on {d.toDateString()}</p>
        }
        else {
            ifPosted = '';
        }
        return (
            <div id='createpostall'>
                <Tabs defaultActiveKey="1" tabBarStyle={this.tabcontainer}>
                    <TabPane tab={
                        <span>
                            <Icon type="edit" theme="twoTone" />
                            Posting
                        </span>
                    }
                        key='1'>
                        <div className="tabcontainer">
                            <Divider orientation="left" style={{ color: "white", fontSize: "2vw" }}>
                                <span>Your post</span>
                                <Icon type="edit" theme='twoTone'></Icon>
                            </Divider>

                            <div className="post-title-label">Title: </div>
                            <Input className="post-title-input" onChange={this.handleTitle.bind(this)} value={this.state.title} placeholder="Enter question title..." />
                            <br />
                            <div className="post-title-label">Topic: </div>
                            <Select className="post-title-input" value={this.state.topic} onChange={this.topicOnChange.bind(this)} defaultValue="Mathematics" style={{ width: "20vw" }}>
                                <Option value="Mathematics">Mathematics</Option>
                                <Option value="Physics">Physics</Option>
                                <Option value="Economics">Economics</Option>
                                <Option value="Chemistry">Chemistry</Option>
                                <Option value="Biology">Biology</Option>
                                <Option value="Computing">Computing</Option>
                            </Select>
                            <div id='createexampl'></div> {/*Text Editor*/}
                            <Redirect />
                            {ifPosted}
                        </div>

                        <SimpleReactFileUpload></SimpleReactFileUpload>

                    </TabPane>

                    <TabPane tab={
                        <span>
                            <Icon type="camera" theme="twoTone" />
                            Preview
                        </span>
                    }
                        key='2'>
                        <div class="tabcontainer">
                            <Divider orientation="left" style={{ color: "white", fontSize: "2vw" }}>
                                <span>Preview </span>
                                <Icon type="camera" theme='twoTone'></Icon>
                            </Divider>
                            <div className='qntitle' dangerouslySetInnerHTML={{ __html: this.state.title }}></div>
                            <div dangerouslySetInnerHTML={{ __html: this.state.post }} className='preview'></div>
                        </div>
                    </TabPane>
                </Tabs>


            </div>

        )
    }
}

class SimpleReactFileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }
    onFormSubmit(e) {
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file);
    }
    onChange(e) {
        this.setState({ file: e.target.files[0] })
        console.log("1" + e.target.files[0])
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (ev) {
            // The file's text will be printed here
            console.log(ev.target.result)
            fetch("https://662uaw6eqb.execute-api.us-east-1.amazonaws.com" + '/v1/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'image/jpg' },
                body: ev.target.result
            }).then((results) => {
                return results.json(); //return data in JSON (since its JSON data)
            }).then((data) => {
                console.log(data)
            }).catch((error) => {
                message.error({ content: "Oops, connection error" });
            })
        };

        var rawBinary = reader.readAsBinaryString(file);

    }
    fileUpload(file) {
        const url = 'http://example.com/file-upload';
        var formData = new FormData();
        formData.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        console.log(file)
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <h1>File Upload</h1>
                <input type="file" onChange={this.onChange} />
                <button type="submit">Upload</button>
            </form>
        )
    }
}
