<script lang="ts" setup>
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { returnGrade, targetOptions, updateFirestore, targetInScale, updateFirestoreData } from '../functions';
import { store } from '../store'
const pinia = store()
const courseworkModal = ref(false)
const subjectModal = ref(false)
const subName = ref("")
const cwName = ref("")
const cwWeight = ref("")
const target = ref("A")
const trigger = ref()

const unfocus = () => {
  trigger.value.blur()
  console.log("YO")
}

const handleSelect = (key: string) => {
  target.value = key
}

const updateSelect = (key: number, event: string) => {
  pinia.data[key].target = event
  updateFirestoreData(pinia, key)
}

const getGrade = (target: string) => {
  target = target.toUpperCase()
  return returnGrade(target, pinia)
}

const percentage = (i: number) => {
  pinia.data[i].target = pinia.data[i].target.toUpperCase()
  const cw = pinia.data[i].cw
  const grades = cw.map((c: any) => Number(c.weight) * (Number(c.grade) / Number(c.maxGrade)))
  const sum = grades.reduce((a: any, b: any) => a + b, 0)
  if (isNaN(sum)) {
    return 0
  }
  const required = (getGrade(pinia.data[i].target) - sum) * 100 / (100 - cw.reduce((a: any, b: any) => a + Number(b.weight), 0))
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
  target.value = "A"
}

const addCoursework = (i: number) => {
  pinia.data[i].cw.push({
    name: cwName.value,
    weight: cwWeight.value,
    grade: "0",
    maxGrade: "100"
  })
  updateFirestore(pinia)
  resetTempVars()
}

const addSubject = () => {
  pinia.data.push({
    name: subName.value,
    target: target.value ?? "A",
    cw: []
  })
  updateFirestore(pinia)
  resetTempVars()
}

const deleteSubject = async (i: number) => {
  const db = getFirestore()
  pinia.data.splice(i, 1)
  await deleteDoc(doc(db, 'users', pinia.user.email, 'data', pinia.data.length.toString()))
  updateFirestore(pinia)
}

const deleteCoursework = async (i: number, y: number) => {
  const db = getFirestore()
  pinia.data[i].cw.splice(y, 1)
  await deleteDoc(doc(db, 'users', pinia.user.email, 'data', i.toString(), 'cw', y.toString()))
  updateFirestore(pinia)
}
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-600px flex justify-around">
      <n-tooltip>
        <template #trigger>
          <n-button @click="subjectModal = !subjectModal">
            <i-ic:round-add />
          </n-button>
        </template>
        Add Subject
      </n-tooltip>
    </div>
  </div>

  <n-modal :show="subjectModal" @mask-click="resetTempVars"
    style="position: fixed; left: 50%; transform: translateX(-50%); top: 100px">
    <n-card style="width: 400px" title="Add Subject">
      <n-form-item label="Name">
        <n-input v-model:value="subName"></n-input>
      </n-form-item>
      <n-form-item label="Target Grade">
        <n-dropdown @select="handleSelect" :options="targetOptions">
          <n-button>{{ target }}</n-button>
        </n-dropdown>
      </n-form-item>
      <n-button @click="addSubject">Add</n-button>
    </n-card>
  </n-modal>

  <div class="flex justify-center">
    <n-collapse class="max-w-[500px] mt-3 mb-4" accordion>
      <n-card>
        <TransitionGroup name="list">
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
            <template #header-extra>
              <div class="flex justify-around w-[85px]">
                <div>{{ pinia.data[i].target }}</div>
                <div>{{ percentage(i) }}%</div>
              </div>
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
                      <n-button @click="deleteSubject(i)">
                        <i-ic:round-delete style="font-size: 20px;" />
                      </n-button>
                    </template>
                    Delete Subject
                  </n-tooltip>
                </template>

                <div class="flex"></div>
                Marks Required in finals to get
                <div class="w-[45px]">
                  <!-- <n-input placeholder="" v-model:value="pinia.data[i].target"
                    @update:value="updateFirestoreData(pinia, i)" /> -->
                  <n-dropdown @select="(event: any) => updateSelect(i, event)" :options="targetOptions"
                    @clickOutside="unfocus">
                    <n-button ref="trigger">{{ pinia.data[i].target }}</n-button>
                  </n-dropdown>
                </div>

                <div class="flex justify-center mt-4 mb-5">
                  <n-progress v-if="percentage(i) >= 40 && percentage(i) <= 100" type="circle"
                    :percentage="percentage(i)" />
                  <n-progress v-else type="circle" color="red" :percentage="percentage(i)" />
                </div>
                <div class="flex justify-center mb-5">
                  <div v-if="percentage(i) > 100">
                    <n-alert type="warning">
                      <template #header>
                        <div v-if="targetInScale(pinia.data[i].target.toUpperCase(), pinia)">
                          Not possible to get {{ pinia.data[i].target }}
                        </div>
                        <div v-else>
                          Not possible to get A
                        </div>
                      </template>
                    </n-alert>
                  </div>
                </div>
                <TransitionGroup name="sublist">
                  <div class="ml-1" v-for="(x, y) in pinia.data[i].cw" key="i">
                    <n-card>
                      <template #header>
                        <p><b>{{ pinia.data[i].cw[y].name }}</b></p>
                      </template>
                      <template #header-extra>
                        <n-tooltip>
                          <template #trigger>
                            <n-button @click="deleteCoursework(i, y)">
                              <i-ic:round-close />
                            </n-button>
                          </template>
                          Remove Coursework
                        </n-tooltip>
                      </template>
                      <div class="flex justify-between">
                        <n-form-item label="Weight">
                          <n-input type="number" v-model:value="pinia.data[i].cw[y].weight"
                            @update:value="updateFirestoreData(pinia, i)" />
                        </n-form-item>
                      </div>
                      <div class="flex justify-between">
                        <n-form-item label="Grade">
                          <n-input type="number" v-model:value="pinia.data[i].cw[y].grade"
                            @update:value="updateFirestoreData(pinia, i)" />
                        </n-form-item>
                      </div>
                      <div class="flex justify-between">
                        <n-form-item label="Max Grade">
                          <n-input type="number" v-model:value="pinia.data[i].cw[y].maxGrade"
                            @update:value="updateFirestoreData(pinia, i)" />
                        </n-form-item>
                      </div>
                      <div class="flex justify-between">
                        <b>Score</b>
                        <div>{{ getScore(i, y) }}%</div>
                      </div>
                    </n-card>
                    <br>
                  </div>
                </TransitionGroup>
              </n-card>
            </div>
          </n-collapse-item>
        </TransitionGroup>
      </n-card>
    </n-collapse>
  </div>
</template>

<style scoped>
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

.sublist-move,
/* apply transition to moving elements */
.sublist-enter-active,
.sublist-leave-active {
  transition: all 0.5s ease;
}

.sublist-enter-from,
.sublist-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.sublist-leave-active {
  position: absolute;
}
</style>