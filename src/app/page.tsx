"use client"
import { Suspense, useEffect, useState } from 'react';
import papa from "papaparse"
import { motion } from 'framer-motion';

export default function Home() {
    const [data, setData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [aindex, setAindex] = useState(0);

    useEffect(() => {
        fetch("/data.csv").then((response) => {
            response.text().then((text) => {
                const result = papa.parse(text, { header: true });
                setData(result.data);
                console.log(result.data)

                setQuestions(Object.keys(result.data[0]).filter(value => !(
                    value.includes("Feedback") || 
                    value.includes("Points") || 
                    [
                        "ID", 
                        "Start time",
                        "Name",
                        "Completion time",
                        "Total points",
                        "Quiz feedback",
                        "Grade posted time",
                        "Last modified time",
                        "Email"
                    ].includes(value)
                )))
            });
        });
    }, [])

    return (
        <main className="w-screen overflow-hidden flex flex-col items-center text-white pt-10">
            <div className='w-2/3 h-[250px] bg-white mb-6 p-6 rounded-lg flex items-center'>
                <span className='text-2xl italic text-black'>
                    Naturfag - Kap 5: Arv og Evolusjon
                </span>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <div className="relative w-2/3 flex flex-col items-center bg-white text-black rounded-lg mb-16">
                    {(data && questions) && 
                        questions.map((question, index) => {
                            return (
                                <Block 
                                    key={index}
                                    index={index + 1}
                                    question={question}
                                    data={data}
                                />
                            )
                        })
                    }
                </div>
            </Suspense>
        </main>
    );
}

function Block({index, question, data}) {
    const [aindex, setAindex] = useState(0);

    useEffect(() => {
        console.log(data[aindex], aindex)
    }, [aindex])

    return (
        <div className='relative w-full min-h-[200px] px-16 py-8 flex flex-col gap-5'>
            <span className='relative text-lg px-1 h-1/3'>
                {index}. {question}

                <span className='absolute -bottom-2 left-10 origin-center w-1/3 h-[2px] bg-cyan-400/60 ' />
            </span>
            <div className="realtive flex flex-row jusitfy-start w-full h-2/3">
                <div className='w-1/3 h-32 flex sm:flex-row flex-col gap-4 items-center justify-center pr-10'>
                    <motion.button className="w-10 h-10 disabled:opacity-60"
                        whileHover={aindex != 0 ? {scale: 1.06} : {rotate: 10}}
                        whileTap={aindex != 0 ? {scale: 0.9} : {rotate: -10}}
                        disabled={aindex == 0}
                        onClick={() => aindex > 0 && setAindex(prev => prev - 1)}
                    >
                        <img src="/arrow_button.svg" alt="previus" className='-rotate-90' />
                    </motion.button>
                    <motion.button className="w-10 h-10 disabled:opacity-50"
                        whileHover={aindex != data.length - 1 ? {scale: 1.06} : {rotate: 10}}
                        whileTap={aindex != data.length - 1 ? {scale: 0.9} : {rotate: -10}}
                        disabled={aindex == data.length - 1}
                        onClick={() => aindex < data.length - 1 && setAindex(prev => prev + 1)}
                    >
                        <img src="/arrow_button.svg" alt="next" className='rotate-90' />
                    </motion.button>
                </div>

                <div className='w-2/3 h-full text-center flex items-center justify-center'>
                    {data[aindex][question]}
                </div>
            </div>

            <motion.span className='absolute bottom-0 left-1/2 -translate-x-1/2 origin-center w-4/5 h-[2px] bg-gray-500/50'
                initial={{ width: 0 }}
                whileInView={{ width: "90%" }}
                transition={{ duration: 0.5 }}
            />
        </div>
    )
}
