import { useContext } from 'react'
import loadData from '../loadData'
import LinkToPoint from '../components/LinkToPoint'
import LinkToRadar from '../components/LinkToRadar'
import LevelTag from '../components/LevelTag'
import SearchContext from '../contexts/SearchContext'
import withTitle from '../components/withTitle'
import Section from '../components/Section'

const Overview = ({ groupedPoints }) => {
  const { searchQuery } = useContext(SearchContext)
  const filteredPoints = groupedPoints.filter(points => {
    const firstPoint = points[0]
    const text = [firstPoint.name, firstPoint.description].join(' ').toLowerCase()
    return !searchQuery || text.indexOf(searchQuery.toLowerCase()) > -1
  })

  return <Section>
    <h2>Overview</h2>

    <table className="table is-fullwidth">
      <tbody>
      { filteredPoints.map(points => {
        const firstPoint = points[0]

        return <tr key={firstPoint.key}>
          <td><LinkToPoint point={firstPoint} /></td>

          <td className="has-text-right">
            <LinkToRadar radar={firstPoint.radar} />
            <LevelTag level={firstPoint.level} style={{marginLeft: 10}} />

            { points.length > 1 && <LevelTag level="warning" style={{marginLeft: 10, color: 'black'}} text={`+${points.length - 1} More`} /> }
          </td>
        </tr>
      })}
      </tbody>
    </table>
  </Section>
}

export const getStaticProps = async _ => {
  const { points } = await loadData()

  const groupedPoints = points.sort((a, b) => a.key.localeCompare(b.key))
    .reduce((acc, point) => {
      const points = acc[point.key] || []
      return { ...acc, [point.key]: [...points, point] }
    }, {})


  return { props: { groupedPoints: Object.values(groupedPoints) } }
}

export default withTitle(Overview, _ => 'Overview')
