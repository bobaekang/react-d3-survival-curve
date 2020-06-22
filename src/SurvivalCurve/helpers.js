import d3 from '../d3'

export function addSurvivalProbability(data) {
  const newData = data

  newData.forEach((patients) =>
    patients.forEach((patient, i) => {
      const survival = 1 - patient.death / patient.number
      patient.prob = i === 0 ? survival : patients[i - 1].prob * survival
    })
  )

  return newData
}

export function drawSurvivalCurve(svg, dimensions, data) {
  const { width, height, margin } = dimensions

  // set max to larger of 0 and maximum patient time
  const pTimes = data.flatMap((ps) => ps.flatMap((p) => parseFloat(p.time)))
  const max = Math.max(0, ...pTimes)

  // Draw the svg container
  svg = svg
    .attr('width', width + 2 * margin)
    .attr('height', height + 4 * margin)

  // Define scales
  const xScale = d3
    .scaleLinear()
    .domain([-max / 50, max])
    .range([0, width - margin * 2])

  const yScale = d3
    .scaleLinear()
    .domain([1.05, -0.05])
    .range([0, height - margin])

  // Define accessor function
  const lineFunction = d3
    .line()
    .x((d) => xScale(d.time) + 2 * margin)
    .y((d) => yScale(d.prob))
    .curve(d3.curveStepAfter)

  // Define colors
  const colors = d3.scaleOrdinal(d3.schemeCategory10)

  // Plot data
  data.forEach((patients, i) => {
    // Draw line
    svg
      .append('path')
      .attr('d', lineFunction(patients))
      .attr('transform', 'translate(' + 0 + ',' + margin + ')')
      .attr('stroke', colors(i))
      .attr('stroke-width', 2)
      .attr('fill', 'none')

    // Draw dots
    svg
      .selectAll('.dot' + i)
      .data(patients)
      .enter()
      .append('circle')
      .attr('class', 'dot') // Assign a class for styling
      .attr('cx', (d) => xScale(d.time) + 2 * margin)
      .attr('cy', (d) => yScale(d.prob))
      .attr('r', 1.5)
      .attr('stroke', colors(i))
      .attr('stroke-width', 2)

      .attr('fill', 'none')
      .attr('transform', 'translate(' + 0 + ',' + margin + ')')

    // Draw legend
    svg
      .append('circle')
      .attr('cx', 400)
      .attr('cy', 50 + i * 20)
      .attr('r', 6)
      .style('fill', colors(i))

    svg
      .append('text')
      .attr('x', 420)
      .attr('y', 55 + i * 20)
      .text(patients[0].type)
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle')
  })

  // Define axes
  const xAxis = d3.axisBottom(xScale).tickSize(2).tickPadding(6)
  const yAxis = d3.axisLeft(yScale).tickSize(2).tickPadding(6)

  // Draw axes
  svg
    .append('g')
    .attr('class', 'xaxis')
    .attr('transform', `translate(${2 * margin}, ${height})`)
    .call(xAxis)

  svg
    .append('g')
    .attr('class', 'yaxis')
    .attr('transform', `translate(${2 * margin}, ${margin})`)
    .call(yAxis)

  // Draw axis labels
  svg
    .append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin})`)
    .style('text-anchor', 'middle')
    .text('Time (in months)')

  svg
    .append('text')
    .attr('transform', `translate(${margin}, ${height / 2})rotate(-90)`)
    .style('text-anchor', 'middle')
    .text('Survival Rate')
}
