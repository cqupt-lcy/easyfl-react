import { useState, useContext, useEffect } from "react"
import { Select, InputNumber, Button, Modal, Popconfirm, notification } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import './index.css'
import { MyContext } from "../../../pages/content";
import { request } from "../../../resource/MyAxios/myaxios";
export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(JSON.parse((localStorage.getItem('inputValue'))) || {})
  const [api, contextHolder] = notification.useNotification();
  const { trainning, setTrainning } = useContext(MyContext)
  const { testAcc, setTestAcc } = useContext(MyContext)
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    startTraining()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const openNotification1 = () => {
    api.open({
      message: '提示信息',
      description:
        '训练开始',
      duration: 4.5,
      showProgress: true,
      pauseOnHover: true
    });
  };
  const openNotification2 = () => {
    api.open({
      message: '提示信息',
      description:
        '训练终止',
      duration: 4.5,
      showProgress: true,
      pauseOnHover: true
    });
  };
  const startTraining = async () => {
    if (trainning) {
      alert("训练正在进行!")
    }
    else {
      localStorage.removeItem("testacc")
      localStorage.removeItem("logs")
      setTestAcc([])
      await request.post('/train', inputValue)
      setTrainning(true)
      openNotification1()
    }
  }
  const stopTraining = async () => {
    if (trainning) {
      await request.post('/stop')
      openNotification2()
      setTrainning(false)
    }
    else {
      alert('没有正在进行的训练')
    }

  }
  const showTestAcc = () => {
    console.log(testAcc);
  }
  const showStorageMess = () => {
    // console.log(inputValue);
    // console.log(localStorage.getItem("inputValue"))
    // console.log(localStorage.getItem("trainning"))
    // console.log(localStorage.getItem("testacc"));
    console.log(localStorage);


  }
  const clearStorageMess = () => {
    setTestAcc([])
    localStorage.removeItem("testacc")
  }
  useEffect(() => {
    localStorage.setItem('inputValue', JSON.stringify(inputValue))
  }, [inputValue])
  useEffect(() => {
    localStorage.setItem('trainning', JSON.stringify(trainning))
  }, [trainning])
  return (
    <div className="settingwrapper">
      {contextHolder}
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>联邦学习训练控制</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="settingdiv1">
          <label>方法:
            <Select
              className="settingselection"
              value={inputValue['method']}
              style={{ width: 120 }}
              onChange={(v) => {
                setInputValue(prev => ({
                  ...prev,
                  'method': v
                }))
              }}
              options={[
                { value: 'fedavg', label: 'FedAvg' },
                { value: 'fedprox', label: 'FedProx' },
                { value: 'ca2fl', label: 'Ca2Fl' },
                { value: 'fedasync', label: 'FedAsync' },
                { value: 'fedavgm', label: 'FedAvgm' },
                { value: 'fedbuff', label: 'FedBuff' },
                { value: 'fedtest01', label: 'FedTest' },
              ]}
            />
          </label>
          <label>异质性:
            <Select
              className="settingselection"
              value={inputValue['heterogeneity']}
              style={{ width: 130 }}
              onChange={v => setInputValue((prev) => (
                {
                  ...prev,
                  'heterogeneity': v
                }
              ))}>
              <option value={true}>非独立同分布</option>
              <option value={false}>独立同分布</option>
            </Select>
          </label>
          <label>训练方式:
            <Select
              className="settingselection"
              value={inputValue["isAsync"]}
              onChange={v => setInputValue(prev => (
                {
                  ...prev,
                  "isAsync": v
                }
              ))}>
              <option value={true}>异步训练</option>
              <option value={false}>同步训练</option>
            </Select>
          </label>
          <label>数据集:
            <Select
              value={inputValue["dataset"]}
              className="settingselection"
              style={{ width: 120 }}
              onChange={(v) => {
                setInputValue(prev => ({
                  ...prev,
                  "dataset": v
                }))
              }}
              options={[
                { value: 'BloodMnist', label: 'BloodMnist' },
                { value: 'PathMnist', label: 'PathMnist' },
                { value: 'ISIC2017', label: 'ISIC2017' },
                { value: 'Cifar10', label: 'Cifar-10' },
                { value: 'Cifar100', label: 'Cifar-100' },
              ]}
            />
          </label>
        </div>
        <div className="settingdiv2">
          <label>学习率:
            <InputNumber min={0} max={10} step={0.1} className="settingselection" value={inputValue['learningRate']} onChange={(v) => { setInputValue(prev => ({ ...prev, "learningRate": v })) }} />
          </label>
          <label>狄利特雷系数:
            <InputNumber min={0} max={10} step={0.1} className="settingselection" value={inputValue['dirichlet']} onChange={(v) => { setInputValue(prev => ({ ...prev, "dirichlet": v })) }} />
          </label>
          <label>客户端数量:
            <InputNumber min={0} max={10000} step={1} className="settingselection" value={inputValue['clientNum']} onChange={(v) => { setInputValue(prev => ({ ...prev, "clientNum": v })) }} />
          </label>
        </div>
      </div>
      <div className="settingbutton">
        <Button type="primary" onClick={showModal}>开始训练</Button>
        <Modal title="确定以当前设置开始训练？" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>方法：{inputValue['method']}</p>
          <p>异质性：{inputValue['heterogeneity'] ? "非独立同分布" : "独立同分布"}</p>
          <p>训练方式：{inputValue['isAsync'] ? "异步训练" : "同步训练"}</p>
          <p>数据集：{inputValue['dataset']}</p>
          <p>学习率：{inputValue['learningRate']}</p>
          <p>狄利特雷系数：{inputValue['dirichlet']}</p>
          <p>客户端数量：{inputValue['clientNum']}</p>
        </Modal>

        <Popconfirm
          title="停止训练"
          description="确定要停止当前训练？"
          onConfirm={stopTraining}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button type="primary" danger={true}>停止训练</Button>
        </Popconfirm>
        <Button type="primary" onClick={showTestAcc}>打印准确率</Button>
        <Button type="primary" onClick={showStorageMess}>打印数据</Button>
        <Button type="primary" onClick={clearStorageMess}>清除数据</Button>

      </div>
    </div>
  )
}