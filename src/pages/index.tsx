import React from 'react'
import Head from 'next/head'
import * as V from 'victory'
import dayjs from 'dayjs'
import numeral from 'numeral'

import styled from 'styled-components'
import { useCases } from 'src/useCases'
import { UkGovCovidApiDataPoint, UkGovCovidApiResponse } from 'src/ukGovCovidData'
import { GetStaticProps } from 'next'
import { getCases } from './api/cases'

const Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Main = styled.main`
  padding: 5rem 0;
  width: 80vw;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Footer = styled.footer`
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    margin-left: 0.5rem;
  }
  a {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const Logo = styled.img`
  height: 1em;
`

const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  text-align: center;

  a {
    color: #0070f3;
    text-decoration: none;
  }

  a:hover,
  a:focus,
  a:active {
    text-decoration: underline;
  }
`

const getPercentage = (d: UkGovCovidApiDataPoint): number => {
  if (!d?.newCases || !d?.newPCRTestsByPublishDate) return 0
  return (d.newCases / d.newPCRTestsByPublishDate) * 100
}

type Props = {
  cases: UkGovCovidApiResponse
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const cases = await getCases()
  return {
    props: { cases },
  }
}

function Home(props: Props): JSX.Element {
  const { cases } = useCases(props.cases)

  const data = (
    cases?.data.map((d) => ({
      date: d.date,
      newPCRTestsByPublishDate: d.newPCRTestsByPublishDate,
      newCases: d.newCases,
      // newCasesPerTests: (d.newPCRTestsByPublishDate ?? 0) / (d.newCases ?? 0),
      newCasesPerTestsPercentage: getPercentage(d),
      // newCasesPerTests: (d.newCases ?? 0) / (d.newTestsByPublishDate ?? 0),
    })) ?? []
  )
    .filter((d) => dayjs(d.date).isAfter(dayjs('2020-07-01')))
    .sort((d1, d2) => {
      return dayjs(d1.date).isBefore(d2.date) ? 1 : -1
    })
  console.log('data', data)
  // const foo = data.map(d => )
  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Title>
          <span role="img" aria-label="UK flag">
            🇬🇧
          </span>{' '}
          Covid cases in the UK{' '}
          <span role="img" aria-label="UK flag">
            🇬🇧
          </span>
        </Title>
        <V.VictoryChart theme={V.VictoryTheme.grayscale} width={800} height={500}>
          <V.VictoryBar
            data={data}
            x="date"
            y="newCasesPerTestsPercentage"
            sortKey="x"
            sortOrder="descending"
            range={{ y: [0, 100] }}
          />
          <V.VictoryAxis
            dependentAxis
            scale="linear"
            label="Positive cases out of tests taken per day"
            tickFormat={(t) => `${numeral(t).format('0')}%`}
            // tickFormat={(t) => `${numeral(t).format('0[.]0 a')}`}
            tickLabelComponent={<V.VictoryLabel angle={0} style={{ fontSize: '9px' }} />}
            // tickCount={20}
            // tickFormat={(t) => `${dayjs(t).format('DD/MM')}`}
            // tickLabelComponent={<V.VictoryLabel angle={-45} style={{ fontSize: '9px' }} />}
            tickValues={[0, 20, 40, 60, 80, 100]}
            // tickValues={data.filter((d, index) => index % 100 === 0)}
          />
          <V.VictoryAxis
            scale="time"
            label="Time"
            tickCount={20}
            tickFormat={(t) => `${dayjs(t).format('DD/MM')}`}
            tickLabelComponent={<V.VictoryLabel angle={-45} style={{ fontSize: '9px' }} />}
            // tickValues={data.filter((d, index) => index % 100 === 0)}
          />
        </V.VictoryChart>
      </Main>

      <Footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <Logo src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </Footer>
    </Container>
  )
}

export default Home
