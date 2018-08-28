<style>
.ivu-modal-footer{
  display:none;
}
</style>

<template>
<div>
  <Button type="primary" @click="modalWindow= true">新增</Button>
  <Button type="error">删除多个</Button>

  <Input search placeholder="Enter something..." v-model="name" @on-click="search" @on-enter="search" />
   <Table border :columns="columns" :data="list"></Table>
    <Page :total="total" show-sizer @on-change="onChangePage" :page-size="rows" :page-size-opts="[5,10,15,20]" @on-page-size-change="onPageSizeChange" />

  <Modal
        v-model="modalWindow"
        title="数据处理"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Name" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="password" prop="password">
            <Input v-model="formValidate.password" placeholder="Enter your password"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
    </Modal>



</div>

</template>
<script>
export default {
  data() {
    return {
      formValidate: {
        name: "",
        password: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "password cannot be empty",
            trigger: "blur"
          }
        ]
      },
      columns: [
        {
          title: "Name",
          key: "name",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.name)
            ]);
          }
        },
        {
          title: "Action",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      list: [],
      total: 0,
      page: 1,
      rows: 5,
      name: "",
      id:'',
      modalWindow: false
    };
  },
  methods: {
    ok() {
      this.$Message.info("Clicked ok");
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    handleSubmit(name) {
          if (this.id.length != 0) {
            //修改操作
            this.axios({
              url: `http://localhost:3000/users/data/${this.id}`,
              method: "put",
              data: this.formValidate
            }).then(res => {
              this.modalWindow = false;
              this.getList();
              this.id = "";
              this.$refs[name].resetFields();
            });
          } else {
            this.axios({
              url: `http://localhost:3000/users/data`,
              method: "post",
              data: this.formValidate
            }).then(res => {
              this.modalWindow = false;
              this.$Message.success("success");
              this.getList();
            });
          }
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    edit(params) {
      this.modalWindow = true;
      this.axios({
        method: "put",
        url: `http://localhost:3000/users/data/${params.row._id}`
      }).then(res => {
        this.formValidate = res.data;
        console.log(res.data._id);
        this.id = res.data._id;
      });
    },
    remove(params) {
      this.$Modal.confirm({
        title: "删除确认框",
        content: "<p>你确认删除这条记录吗？</p>",
        onOk: () => {
          this.axios({
            method: "delete",
            url: `http://localhost:3000/users/data/${params.row._id}`
          }).then(res => {
            this.getList();
          });
        },
        onCancel: () => {
          this.$Message.info("Clicked cancel");
        }
      });
    },

    getList() {
      this.axios({
        method: "post",
        url: "http://localhost:3000/users/list",
        data: {
          page: this.page,
          rows: this.rows,
          name: this.name
        }
      }).then(res => {
        this.list = res.data.rows;
        this.total = res.data.total;
      });
    },
    onChangePage(page) {
      this.page = page;
      this.getList();
    },
    onPageSizeChange(pageSize) {
      this.rows = pageSize;
      this.getList();
    },
    search() {
      this.getList();
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
