import { useRef, useState } from 'react'
import './App.less'
import { Button ,Spin,message} from 'antd';
import { AudioOutlined ,RedditOutlined} from '@ant-design/icons';
import 'antd/dist/reset.css';

import  { Configuration, OpenAIApi } from "openai";
interface answerListType{
	type: string,
	content?: string,
	isFinshed: number,
}
function App() {
  	const [inputValue, setInputValue] = useState<string>("")
	const [answerList, setAnswerList] = useState<answerListType[]>([])
	const preItem = useRef<HTMLDivElement>(null)
	const apiKey = ['w', 'G', 'e', 'E', 'R', 'Y', 'N', 'F', 'N', 'n', 'r', 'w', 'h', 'C', 'D', 'B', 'a', 'v', '0', '9', 'T', '3', 'B', 'l', 'b', 'k', 'F', 'J', 'Q', 'G', '5', 'u', 'E', 'p', '1', 'L', 'M', 'm', 'h', '3', 'P', 'c', 'P', 'S', 'K', 'h', '9', '2'].join('')

	const [messageApi,contextHolder] = message.useMessage();
	const configuration = new Configuration({
		apiKey: 'sk-' + apiKey,
	});
	const openai = new OpenAIApi(configuration);


	const quize = ()=>{
		console.log("提问",inputValue)
		setAnswerList([...answerList,{
			type:'question',
			content:inputValue,
			isFinshed: 1,
		},{
			type: 'answer',
			content: '正在思考',
			isFinshed: 0,
		}])
		console.log("resf",preItem)
		preItem?.current?.scrollIntoView()
		setInputValue("")
		getMessage(inputValue)
	}

	const getMessage = async (questionText:string)=>{
		openai.createCompletion({
			model: "text-davinci-003",
			prompt: questionText,
			max_tokens: 600,
			temperature: 1,
		}).then((response )=>{
			// 打印 API 返回的结果
			console.log(response,response.data.choices[0],answerList);
			setAnswerList(answerList=>answerList.map((item,index)=>{
					if(index<answerList.length-1){
						return item
					}else{
						return {
							type: 'answer',
							content: response?.data?.choices[0]?.text?.replace(/\n{2}/, " "),
							isFinshed: 1,
						}
					}
				}))
		}).catch((e)=>{
			messageApi.open({
				type: 'error',
				content: '你的 Key 失效了！',
			  });
		})
	}

  return (
    <div className="App">
		{contextHolder}
		<div className='input_box'>
			<input type="text" className='input' value={inputValue} onChange={e=>setInputValue(e.target.value)}></input>
			<Button 
				type="primary" 
				size='large' 
				className='btn'
				onClick={quize}
			>提问</Button>
		</div>
		<div className='answer_box'>
			<div className='answer'>{
				answerList.map((item,index)=>{
					if(item.type==='question'){
						// 问题
						return (
							<div className='item' key={index}>
								<div><AudioOutlined style={{fontSize:'24px',color:'#646cffaa'}}/> </div>
								<span className='span'>{item.content}</span>
							</div>
						)
					}else{
						// 回答
						if(item.isFinshed === 0){
							// 加载中
							return (
								<div className='item' ref={preItem} key={index}>
									<div><RedditOutlined style={{fontSize:'24px',color:'#42b883aa'}}/> </div>
									<span className='span'><Spin /></span>
								</div>
							)
						}else{
							// 回复答案
							return (
								<div className='item' key={index}>
									<div><RedditOutlined style={{fontSize:'24px',color:'#42b883aa'}}/> </div> 
									<span className='span'>{item.content}</span>
								</div>
							)
						}
					}
				})
			}</div>
		</div>
    </div>
  )
}

export default App
