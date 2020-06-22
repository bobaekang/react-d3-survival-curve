import React, { useEffect, useRef } from 'react'
import d3 from '../d3'
import { addSurvivalProbability, drawSurvivalCurve } from './helpers'

const SurvivalCurve = ({ data }) => {
  const dataWithProbability = addSurvivalProbability(data)
  const svgRef = useRef(null)
  const svgDimensions = {
    width: 500,
    height: 300,
    margin: 40,
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    drawSurvivalCurve(svg, svgDimensions, dataWithProbability)
  }, [dataWithProbability, svgDimensions])

  return <svg ref={svgRef} />
}

export default SurvivalCurve
