<template>
    <table>
        <caption>Units</caption>
        <thead>
            <tr>
                <th id="code" scope="col">Code</th>
                <th id="description" scope="col">Description</th>
                <th id="cp" scope="col">cp</th>
                <th id="type" scope="col">Type</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="unit in units" :key="unit.code">
                <td headers="code">{{unit.code}}</td>
                <td headers="description">{{unit.desc}}</td>
                <td headers="cp">{{unit.cp}}</td>
                <td headers="type">{{unit.type}}</td>
            </tr>
        </tbody>
    </table>
</template>
<script>
import Units from '../assets/units.json'
export default {
  data() {
    return {
      units: Units
    }
  }
}
</script>
<style>
    table {
        width: 100%;
        margin-top: 1%;
        border-collapse: collapse;
    }
    table, th, td {
        border: 1px solid black;
    }
    caption {
        font-size: 36px;
    }
</style>