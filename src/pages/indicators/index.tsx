import { GetStaticProps } from 'next';
import config from '../../lib/config';
import { FastFact, IndicatorContent, listIndicatorContent } from '../../lib/indicators';
import React from 'react';

type Props = {
    posts: IndicatorContent[];
    pagination: {
        current: number;
        pages: number;
    };
};
function Fact(props){
    return (
        <>{props.fact}</>
    );
}

function Indicator(props: {data: IndicatorContent}){
    const data = props.data;
    return (<>
        <h2 key={data.title}>{data.title}</h2>
        <p key={data.introduction}>{data.introduction}</p>
        <p key={data.category}>{data.category}</p>
        <p key={"is_new"}>{data.is_new}</p>
        <p key={data.creation_datetime}>{data.creation_datetime}</p>
        {data.fast_facts?.map(x=><Fact key={x} fact={x}/>)}
    </>);
}

export default function Index({ posts, pagination }: Props) {
    return (
        <ul>
        {
            posts.map(x => <li key={x.title}><Indicator key={x.title} data={x}/></li>)
        }
        </ul>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const posts = listIndicatorContent(1, config.posts_per_page);
    const pagination = {
        current: 1,
        pages: 2,
    };
    return {
        props: {
            posts,
            pagination,
        },
    };
};
