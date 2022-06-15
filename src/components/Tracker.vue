<script lang="ts" setup>
import { store } from '../store'

const pinia = store()
const courseworkModal = ref(false)
const subjectModal = ref(false)
const subName = ref("")
const cwName = ref("")
const cwWeight = ref("")
const target = ref("A")
const getGrade = () => {
  target.value = target.value.toUpperCase()
  if (target.value === "A+") {
    return pinia.scale.Ap
  } else if (target.value === "A") {
    return pinia.scale.A
  } else if (target.value === "A-") {
    return pinia.scale.Am
  } else if (target.value === "B+") {
    return pinia.scale.Bp
  } else if (target.value === "B") {
    return pinia.scale.B
  } else if (target.value === "B-") {
    return pinia.scale.Bm
  } else if (target.value === "C+") {
    return pinia.scale.C
  } else if (target.value === "C") {
    return pinia.scale.C
  } else if (target.value === "D") {
    return pinia.scale.D
  } else {
    return 80
  }
}
const percentage = (i: number) => {
  const cw = pinia.data[i].cw
  const grades = cw.map((c: any) => Number(c.weight) * (Number(c.grade) / Number(c.maxGrade)))
  const sum = grades.reduce((a: any, b: any) => a + b, 0)
  if (isNaN(sum)) {
    return 0
  }
  const required = (getGrade() - sum) * 100 / (100 - cw.reduce((a: any, b: any) => a + Number(b.weight), 0))
  return Math.round(required)
}
const getScore = (i: number, y: number) => {
  const cw = pinia.data[i].cw[y]
  return (Number(cw.grade) * Number(cw.weight) / Number(cw.maxGrade)).toFixed(2)
}
const resetTempVars = () => {
  courseworkModal.value = false
  subjectModal.value = false
  subName.value = ""
  cwName.value = ""
  cwWeight.value = ""
}

const addCoursework = (i: number) => {
  pinia.data[i].cw.push({
    name: cwName.value,
    weight: cwWeight.value,
    grade: "0",
    maxGrade: "100"
  })
  resetTempVars()
}
const addSubject = () => {
  pinia.data.push({
    name: subName.value,
    cw: []
  })
  resetTempVars()
}
</script>

<template>
  <n-tooltip>
    <template #trigger>
      <n-button @click="subjectModal = !subjectModal">
        <i-ic:round-add />
      </n-button>
    </template>
    Add Subject
  </n-tooltip>

  <n-modal :show="subjectModal" @mask-click="resetTempVars"
    style="position: fixed; left: 50%; transform: translateX(-50%); top: 100px">
    <n-card style="width: 400px" title="Add Subject">
      <n-form-item label="Name">
        <n-input v-model:value="subName"></n-input>
      </n-form-item>
      <n-button v-if="subName != ''" @click="addSubject">Add</n-button>
    </n-card>
  </n-modal>

  <div class="flex justify-center">
    <n-collapse class="max-w-[500px] mt-3">
      <n-card>
        <n-collapse-item v-for="(d, i) in pinia.data" key="i">
          <n-modal :show="courseworkModal" @mask-click="resetTempVars"
            style="position: fixed; left: 50%; transform: translateX(-50%); top: 100px">
            <n-card style="width: 400px" title="Add Coursework">
              <div class="flex justify-center">
                <div class="w-[300px]">
                  <n-form-item label="Name">
                    <n-input v-model:value="cwName"></n-input>
                  </n-form-item>
                  <n-form-item label="Weight">
                    <n-input type="number" v-model:value="cwWeight"><template #suffix>%</template></n-input>
                  </n-form-item>
                  <n-button v-if="(cwName != '') && (cwWeight != '')" @click="addCoursework(i)">Add</n-button>
                </div>
              </div>
            </n-card>
          </n-modal>
          <template #header>
            {{ pinia.data[i].name }}
          </template>
          <div class="flex justify-center">
            <n-card class="max-w-[500px]" title="Summary">
              <template #header-extra>
                <n-tooltip>
                  <template #trigger>
                    <n-button @click="courseworkModal = !courseworkModal">
                      <i-ic:round-add style="font-size: 20px;" />
                    </n-button>
                  </template>
                  Add Coursework
                </n-tooltip>
                <n-tooltip>
                  <template #trigger>
                    <n-button @click="pinia.data.splice(i, 1)">
                      <i-ic:round-delete style="font-size: 20px;" />
                    </n-button>
                  </template>
                  Delete Subject
                </n-tooltip>
              </template>

              <div class="flex"></div>
              Marks Required in finals to get <div class="w-[45px]">
                <n-input placeholder="" v-model:value="target" />
              </div>
              <div class="flex justify-center mt-4 mb-5">
                <n-progress v-if="percentage(i) >= 40 && percentage(i) <= 100" type="circle"
                  :percentage="percentage(i)" />
                <n-progress v-else type="circle" color="red" :percentage="percentage(i)" />
              </div>
              <div class="flex justify-center mb-5">
                <div v-if="percentage(i) > 100 && target != ''">
                  <n-alert type="warning">
                    <template #header>
                      Not possible to get {{ target }}
                    </template>
                  </n-alert>
                </div>
                <div v-else-if="percentage(i) > 100 && target == ''">
                  <n-alert title="Not possible to get A" type="warning">

                  </n-alert>
                </div>
              </div>
              <div class="ml-1" v-for="(x, y) in pinia.data[i].cw" key="i">
                <n-card>
                  <template #header>
                    <p><b>{{ pinia.data[i].cw[y].name }}</b></p>
                  </template>
                  <template #header-extra>
                    <n-tooltip>
                      <template #trigger>
                        <n-button @click="pinia.data[i].cw.splice(y, 1)">
                          <i-ic:round-close />
                        </n-button>
                      </template>
                      Remove Coursework
                    </n-tooltip>
                  </template>
                  <div class="flex justify-between">
                    <n-form-item label="Weight">
                      <n-input type="number" v-model:value="pinia.data[i].cw[y].weight" />
                    </n-form-item>
                  </div>
                  <div class="flex justify-between">
                    <n-form-item label="Grade">
                      <n-input type="number" v-model:value="pinia.data[i].cw[y].grade" />
                    </n-form-item>
                  </div>
                  <div class="flex justify-between">
                    <n-form-item label="Max Grade">
                      <n-input type="number" v-model:value="pinia.data[i].cw[y].maxGrade" />
                    </n-form-item>
                  </div>
                  <div class="flex justify-between">
                    <b>Score</b>
                    <div>{{ getScore(i, y) }}%</div>
                  </div>
                </n-card>
                <br>
              </div>
            </n-card>
          </div>
        </n-collapse-item>
      </n-card>
    </n-collapse>
  </div>
</template>