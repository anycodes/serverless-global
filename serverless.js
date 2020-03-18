const { Component } = require('@serverless/core')
const path = require('path')
const yamljs = require('yamljs')

class GlobalVar extends Component {
  async getOutput(inputs = {}, output) {
    const reg = /\${file\(.*?\)}/g
    for (const key in inputs) {
      const regResult = reg.exec(inputs[key])
      if (regResult) {
        const file = path.join(process.cwd(), inputs[key].slice(7, -2))
        const yaml = yamljs.load(file)
        const jsonStr = JSON.stringify(yaml)
        const jsonTemp = JSON.parse(jsonStr, null)
        if (jsonTemp) {
          output[key] = await this.getOutput(jsonTemp, {})
        }
      } else {
        output[key] = inputs[key]
      }
    }
    return output
  }

  async default(inputs = {}) {
    const output = {}
    await this.getOutput(inputs, output)
    this.state = output
    await this.save()
    return output
  }

  async remove(inputs = {}) {
    this.context.status(`Removing`)
    this.state = {}
    await this.save()
    this.context.debug(`Finished`)
    return {}
  }
}

module.exports = GlobalVar
