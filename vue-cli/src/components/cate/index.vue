<style>
.ivu-modal-footer {
  display: none;
}
</style>
<template>
  <div>
    <Tree :data="list" :render="renderContent"></Tree>


    <Modal
        v-model="modalWindow"
        title="数据处理"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="text" prop="text">
            <Input v-model="formValidate.text" placeholder="Enter your text"></Input>
        </FormItem>
        <FormItem label="content" prop="content">
            <Input v-model="formValidate.content" placeholder="Enter your content"></Input>
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
      list: [],
      id: "",
      formValidate: {
        text: "",
        content: ""
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
      modalWindow: false,
      buttonProps: {
        type: "default",
        size: "small"
      }
    };
  },
  methods: {
    ok() {
      this.$Message.info("Clicked ok");
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.append(data);
                    // this.edit(data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.remove(data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-brush-outline"
                }),
                on: {
                  click: () => {
                    this.edit(data);
                    this.amend(data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    append(data) {
      this.modalWindow = true;
      this.parentId = data._id;
    },
    remove(params) {
      this.$Modal.confirm({
        title: "删除确认框",
        content: "<p>你确认删除这条记录吗？</p>",
        onOk: () => {
          console.log(params);
          this.axios({
            method: "delete",
            url: `http://10.31.165.29:3000/sort/data/${params._id}`
          }).then(res => {
            this.getList();
          });
        },
        onCancel: () => {
          this.$Message.info("Clicked cancel");
        }
      });
    },
    amend(data) {
      this.modalWindow = true;
    },
    getList() {
      this.axios({
        method: "post",
        url: "http://10.31.165.29:3000/sort/list"
      }).then(res => {
        this.list = res.data;
      });
    },

    handleSubmit(name) {
      if (this.id.length != 0) {
        //修改操作
        this.axios({
          url: `http://10.31.165.29:3000/sort/data/${this.id}`,
          method: "put",
          data: this.formValidate
        }).then(res => {
          this.modalWindow = false;
          this.getList();
          this.id = "";
          this.$refs[name].resetFields();
        });
      } else {
        this.formValidate.title = this.formValidate.text;
        this.formValidate.parentId = this.parentId;
        this.formValidate.type = 1;
        this.axios({
          url: `http://10.31.165.29:3000/sort/data`,
          method: "post",
          data: this.formValidate
        }).then(res => {
          this.modalWindow = false;
          this.$Message.success("success");
          this.getList();
        });
      }
    },
    edit(params) {
      this.modalWindow = true;

      this.axios({
        method: "put",
        url: `http://10.31.165.29:3000/sort/data/${params._id}`
      }).then(res => {
        this.formValidate = res.data;
        this.id = res.data._id;
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

