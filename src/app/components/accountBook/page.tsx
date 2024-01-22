'use client'

import React, { useState } from 'react';

interface Transaction {
  id: number;
  category: string;
  amount: string;
  description: string;
}

const countlist = [
  '외식비', '생활품', '교육비/문화', '교통비', '통신비', '청약 돈', '미용', '의료비','저축(은행적금)','저축(결혼자금)', '저축(아파트 청약)', '저축(주식투자)',
  '수입(월급)','수입(투자로 번돈)','수입(부업)',
]

const categories = [
  '외식비', '생활품', '교육비/문화', '교통비', '통신비', '청약 돈', '미용', '의료비',
];
const savings = [
  '저축(은행적금)','저축(결혼자금)', '저축(아파트 청약)', '저축(주식투자)'
];
  const income = [
  '수입(월급)','수입(투자로 번돈)','수입(부업)',
]
const BudgetTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inputData, setInputData] = useState({
    category: '',
    amount: '',
    description: '',
    addMoney: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // 수정: addMoney의 경우 숫자로 누적하도록 처리
    if (name === 'addMoney') {
      setInputData((prevData) => ({
        ...prevData,
        addMoney: parseFloat(value), // Change parseInt to parseFloat
      }));
    } else {
      setInputData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTransaction: Transaction = { ...inputData, id: Date.now() };
    
    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);

    // 총 수입액에 누적
    setInputData((prevData) => ({
      ...prevData,
      addMoney: prevData.addMoney + parseFloat(inputData.amount),
    }));
  };

  const calculateTotal = (category: string) => {
    return transactions.reduce((total, transaction) => {
      return transaction.category === category ? total + parseFloat(transaction.amount) : total;
    }, 0);
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="mb-10 text-3xl font-bold">가계부</h1>

      {/* 거래 입력 폼 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="">
          <div className="mb-4 ">

            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <label htmlFor="addMoney" className="block mb-2 text-lg font-bold text-center text-gray-600">이달 총 수입</label>
                  <input
                    type="text"
                    id="addMoney"
                    value={`${inputData.addMoney} 원`}
                    name="addMoney"
                    onChange={handleChange}
                    className="h-12 form-input"
                  />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="allExpense" className="block mb-2 text-lg font-bold text-center text-gray-600">이달 총 지출</label>
                  <input
                    type="text"
                    id="allExpense"
                    name="allExpense"
                    onChange={handleChange}
                    className="h-12 form-input"
                  />
              </div>

              <div className='flex flex-col'>
              <label htmlFor="allSave" className="block mb-2 text-lg font-bold text-center text-gray-600">이달 총 저축</label>
                <input
                  type="text"
                  id="allSave"
                  name="allSave"
                  onChange={handleChange}
                  className="h-12 form-input"
                />
              </div>

              <div className='flex flex-col'>
              <label htmlFor="remainPay" className="block mb-2 text-lg font-bold text-center text-gray-600">이달 남은 돈</label>
                <input
                  type="text"
                  id="remainPay"
                  name="remainPay"
                  onChange={handleChange}
                  className="h-12 form-input"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mb-4 mt-14">
              <label htmlFor="category" className="block text-lg font-bold text-gray-600">내역 카테고리</label>
              <select
                id="category"
                name="category"
                value={inputData.category}
                onChange={handleChange}
                className="h-8 form-input"
              >
                <option value="" disabled>상세보기</option>
                {countlist.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label htmlFor="amount" className="block text-lg font-bold text-gray-600">금액</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={inputData.amount}
                onChange={handleChange}
                className="h-8 form-input"
              />
            </div>
          </div>
        
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-lg font-bold text-gray-600">수입, 지출 내역을 자세히 적어주세요.</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={inputData.description}
            onChange={handleChange}
            className="w-full form-textarea"
          />
        </div>
        <div className='flex justify-end gap-6'>
          <button type="submit" className="p-2 rounded form-button bg-sky-500">저장</button>
          <button type="submit" className="p-2 bg-red-500 rounded form-button">취소</button>
        </div>

      </form>

      {/* 거래 목록 */}
      <h2 className="mb-2 text-2xl font-bold">1달간 입금 ⸰ 출금 내역</h2>
      <table className="w-full mb-8 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-center border-b">내역 카테고리</th>
            <th className="px-4 py-2 text-center border-b">금액</th>
            <th className="px-4 py-2 text-center border-b">설명</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td className="px-4 py-2 text-center border-b">{transaction.category}</td>
              <td className="px-4 py-2 text-center border-b">{transaction.amount}원</td>
              <td className="px-4 py-2 text-center border-b">{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 카테고리별 합계 표 */}
      <h2 className="mb-2 text-2xl font-bold">지출</h2>
      <table className="w-full mb-8 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b">카테고리</th>
            <th className="px-4 py-2 border-b">합계</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category}>
              <td className="px-4 py-2 text-center border-b">{category}</td>
              <td className="px-4 py-2 text-center border-b">{calculateTotal(category)}원</td>
            </tr>
          ))}
        </tbody>
      </table>


      <h2 className="mb-2 text-2xl font-bold">수입</h2>
      <table className="w-full mb-8 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b">카테고리</th>
            <th className="px-4 py-2 border-b">합계</th>
          </tr>
        </thead>
        <tbody>
          {income.map(income => (
            <tr key={income}>
              <td className="px-4 py-2 text-center border-b">{income}</td>
              <td className="px-4 py-2 text-center border-b">{calculateTotal(income)}원</td>
            </tr>
          ))}
        </tbody>
      </table>

        <h2 className="mb-2 text-2xl font-bold">저축</h2>
      <table className="w-full mb-8 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b">카테고리</th>
            <th className="px-4 py-2 border-b">합계</th>
          </tr>
        </thead>
        <tbody>
          {savings.map(save => (
            <tr key={save}>
              <td className="px-4 py-2 text-center border-b">{save}</td>
              <td className="px-4 py-2 text-center border-b">{calculateTotal(save)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default BudgetTracker;
