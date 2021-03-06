<template>
  <div v-loading="loading" class="app-container">
    <div>
      <el-button type="success" @click="loadTable">查询</el-button>
      <el-button v-permission="['/room/type/create']" type="primary" @click="handleCreate">添加房型</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 10px"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          prop="name"
          label="房型"
          width="200"
          align="center"
        />
        <el-table-column
          prop="number"
          label="床位"
          width="100"
          align="center"
        />
        <el-table-column
          v-if="checkPermission(['/room/type/update', '/room/type/applySpec', '/room/type/delete'])"
          label="操作"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['/room/type/update']"
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['/room/type/applySpec']"
              size="mini"
              type="success"
              @click="handleSpec(scope.row)"
            >应用规格
            </el-button>
            <el-button
              v-permission="['/room/type/delete']"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :current.sync="listQuery.current" :size.sync="listQuery.size" :total="total" @load="loadTable"/>
      <el-dialog title="房型信息" :visible.sync="showEdit" width="500px" :close-on-click-modal="false">
        <room-type-edit ref="RoomTypeEdit" :is-create="isCreate" @success="successEdit" />
      </el-dialog>
      <el-dialog title="应用规格" :visible.sync="showSpec" width="500px" :close-on-click-modal="false">
        <el-select v-model="applySpecId" style="width: 100%" placeholder="规格" @change="changeSpec">
          <el-option
            v-for="item in specList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RoomTypeEdit from './components/RoomTypeEdit'
import Pagination from '@/components/Public/Pagination'

export default {
  name: 'RoomType',
  components: {
    RoomTypeEdit,
    Pagination
  },
  data() {
    return {
      tableData: [],
      total: 0,
      listQuery: {
        current: 1,
        size: 10
      },
      specList: [],
      loading: false,
      showEdit: false,
      showSpec: false,
      isCreate: true,
      typeId: null,
      applySpecId: null
    }
  },
  mounted() {
    this.init()
    this.loadTable()
  },
  methods: {
    async init() {
      const { data } = await this.getRequest('/room/type/index')
      this.specList = data.specList
    },
    // 加载table数据
    async loadTable() {
      this.loading = true
      const { data } = await this.getRequest(`/room/type/table`, {
        current: this.listQuery.current,
        size: this.listQuery.size
      })
      this.tableData = data.data
      this.total = data.count
      this.loading = false
    },
    handleCreate() {
      this.isCreate = true
      this.showEdit = true
    },
    handleEdit(row) {
      this.showEdit = true
      this.isCreate = false
      this.$nextTick(() => {
        this.$refs.RoomTypeEdit.loadInfo(row.id)
      })
    },
    handleSpec(row) {
      this.typeId = row.id
      this.showSpec = true
    },
    // 应用规格
    async changeSpec(specId) {
      try {
        this.loading = true
        const { msg } = await this.postRequest(`/room/type/applySpec/${this.typeId}/${specId}`)
        this.showSpec = false
        this.$message({ message: msg, type: 'success' })
        this.loadTable()
      } finally {
        this.loading = false
      }
    },
    // 删除房型
    async handleDelete(row) {
      try {
        await this.$confirm('是否要删除该用户', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })

        this.loading = true
        const { msg } = await this.deleteRequest(`/room/type/delete/${row.id}`)
        this.loading = false

        this.$message({ message: msg, type: 'success' })
        this.loadTable()
      } catch (e) {
        this.loading = false
      }
    },
    // 房型更新后的回调方法
    successEdit() {
      this.showEdit = false
      this.loadTable()
    }
  }
}
</script>

<style scoped>

</style>
