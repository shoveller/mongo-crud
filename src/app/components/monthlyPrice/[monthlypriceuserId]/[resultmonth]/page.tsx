'use client'

import { useEffect, useState } from 'react';
import Link from "next/link"
import SideBar from "../../../sideBar/page"
import { Layout, Menu } from 'antd';
import {
  DollarCircleOutlined,
  WalletOutlined,
  FundOutlined,
  PieChartOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { getCookie } from 'cookies-next';

import {Line ,Bar} from  '@ant-design/charts'
import Item from 'antd/es/descriptions/Item';

import Calendar from 'react-calendar';
import moment from 'moment';
import './monthlyPrice.css'; // CSS 파일 import

import { useSelectedDate } from '../../../../recoil/DateAtom';



interface CalendarPageProps {
  formattedSelectedDate: string; // 프롭으로 전달할 formattedSelectedDate의 타입 정의
}

const { Header, Content, Footer, Sider } = Layout;

interface HouseKeepingItem {
  category: string;
  amount: string;
  description: string;
  createDate: string;
}

interface DataItem {
  year: string;
  value: number;
}

export default function MonthlyPriceData() {
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('1');
  const [dataMap, setDataMap] = useState<{ [key: string]: DataItem[] }>({
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
  });
  const userIdCookie = getCookie('userId'); // 임시로 대체

const [showCalendar, setShowCalendar] = useState(false);
const [selectedDate, setSelectedDate] = useState<Date | Date[] | any>();

const [selectedRange, setSelectedRange] = useState<Date[]>([]);

const [SelectedDaterr, setSelectedDaterr] = useSelectedDate();

const handleDateChange = (date: Date | any | Date[]) => {
  setSelectedDate(date);
  setSelectedDaterr(date);
  setShowCalendar(false);
};

const handleMonthChange = (value: Date) => {
  setSelectedDate(value);
  setShowCalendar(false);
};

const formattedSelectedDate = selectedDate instanceof Date ? moment(selectedDate).format('YYYY-MM') : '';


console.log("formattedSelectedDate", formattedSelectedDate);


const newDate = SelectedDaterr ? moment(selectedDate).format('YYYY-MM') : getCookie('month');


console.log("달력에서 가져온 newDate", newDate);

console.log("SelectedDaterr", SelectedDaterr);


  const handleMenuClick = (e: { key: string }) => {
    setSelectedMenuKey(e.key);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<HouseKeepingItem[]>(`${process.env.NEXT_PUBLIC_API_URL}/getHouseKeeping/${userIdCookie}/${newDate}`);
        const resultData = response.data;
        console.log("resultData", resultData);
        const formattedData = formatData(resultData);
        setDataMap(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  console.log("newDate, useEffect", newDate);
  }, [newDate]);

  const formatData = (data: HouseKeepingItem[]): { [key: string]: DataItem[] } => {
    const formattedData: { [key: string]: DataItem[] } = {
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
    };

    data.forEach(item => {
      if (item.category === 'Incoming') {
        formattedData['2'].push({value: parseInt(item.amount),year: item.createDate });
      } else if (item.category === 'savings') {
        formattedData['3'].push({value: parseInt(item.amount), year: item.createDate,  });
      }  
      else if (item.category === 'Investment') {
        formattedData['4'].push({ year: item.createDate, value: parseInt(item.amount) });
      }else {
        formattedData['1'].push({ value: parseInt(item.amount), year: item.createDate});
      }
    });

    console.log("formatData", formatData);

    return formattedData;
  };

  return (
    <>
      <header className='flex justify-between px-40 py-4 bg-sky-50'>
        <div className='flex items-center gap-4'>
          <Link className="p-3" href={`/components/home`}>
            ALIVE-MONEY
          </Link>
        </div>
        <SideBar/>
      </header>

      <Layout style={{ minHeight: '100vh'}}>
        <Sider collapsible>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" selectedKeys={[selectedMenuKey]} onClick={handleMenuClick}>
            {[
              { key: '1', icon: <PieChartOutlined />, title: '지출' },
              { key: '2', icon: <DollarCircleOutlined />, title: '수입' },
              { key: '3', icon: <WalletOutlined />, title: '저축' },
              { key: '4', icon: <FundOutlined />, title: '투자' },
              { key: '5', icon: <CheckSquareOutlined />, title: '나의 씀씀이 결과' }
            ].map(item => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.title}
              </Menu.Item>
            ))}
          </Menu>
          <div className="relative text-center">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-2 py-2 text-white bg-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                {selectedDate ? (Array.isArray(selectedDate) ? '날짜 선택됨' : formattedSelectedDate) : '날짜 선택'}
              </button>
              {showCalendar && (
                <div className="absolute w-64 mt-2 top-full">
                  <Calendar
                      onChange={handleDateChange}
                      value={new Date()} 
                      onClickMonth={(value: Date) => handleMonthChange(value)}
                      className="p-4 my-4 text-center border border-gray-300 rounded-md shadow-md bg-slate-100"
                      calendarType="US"
                      formatMonthYear={(locale, date) => moment(date).format('YYYY. MM')}
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      minDetail="month" // 월 단위로만 선택 가능하도록 설정
                      tileClassName={({ date }) =>
                        selectedRange.length > 1 &&
                        date >= selectedRange[0] &&
                        date <= selectedRange[selectedRange.length - 1]
                          ? 'bg-blue-500 text-white'
                          : ''
                      }
                    />
                  </div>
                    )}
              </div>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            
            <Bar
                data={dataMap[selectedMenuKey]}
                xField="value"
                yField="year"
                horizontal={true} // 그래프 방향을 세로로 변경
              />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>돈은 누군지도 묻지 않고, 그 소유자에게 권리를 준다.</Footer>
        </Layout>
      </Layout>
    </>
  )
}