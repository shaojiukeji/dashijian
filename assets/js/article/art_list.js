$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
    
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
    
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
      }
    


     // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
      }


      initTable()
      initCate()

      // 获取文章分类方法
      function initTable() {
        $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取文章列表失败！')
            }
            // res.data = [
            //     {
            //       id: 1,
            //       title: "title",
            //       cate_name: "美食",
            //       pub_date: "2021-1-16 20:9:3.817",
            //       state: "草稿"
            //     },
            //     {
            //       id: 2,
            //       title: "title",
            //       cate_name: "美食",
            //       pub_date: "2021-1-16 20:8:8.817",
            //       state: "草稿"
            //     },
            //     {
            //       id: 3,
            //       title: "title",
            //       cate_name: "美食",
            //       pub_date: "2021-1-16 20:4:3.817",
            //       state: "草稿"
            //     },
            //     {
            //       id: 3,
            //       title: "title",
            //       cate_name: "美食",
            //       pub_date: "2021-1-16 20:4:3.817",
            //       state: "草稿"
            //     },
            //     {
            //       id: 4,
            //       title: "title",
            //       cate_name: "美食",
            //       pub_date: "2021-1-16 20:8:3.817",
            //       state: "草稿"
            //     }
            //   ];
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 调用分页
            renderPage(res.total)
              }
          })
      }

      // 初始化文章的方法
      function initCate() {
          $.ajax({
              method: 'GET',
              url: '/my/article/cates',
              success: function(res) {
                  if(res.status !== 0 ){
                      return layer.msg('获取分类数据失败！')
                  }
                  // 调用模板引擎渲染分类的可选项
                  var htmlStr = template('tpl-cate', res)
                  $('[name=cate_id]').html(htmlStr)
                  // 通过 layui 重新渲染表单区域的UI结构
                  form.render()
              }
          })
      }

      // 为筛选表单绑定 submit 事件
      $('#form-search').on('click', function(e) {
          e.preventDefault()
          // 获取表单选中项的值
          var cate_id = $('[name=cate_id]').val()
          var state = $('[name=state]').val()
        //   q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 最新数据渲染表格中的数据
        initTable()
      })

      // 定义渲染分页
      function renderPage(total) {
        // 调用 laypage render() 
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout:['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10],
            // 分页 jump回调
            jump: function(obj, first) {
                // 把最新的页码值赋值给Q
                q.pagenum = obj.curr
                // 把最新的赋值到pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的q 重新渲染表格
                 if(!first) {
                     initTable()
                 }
            }
        })
      }

      // 代理的方式 为删除按钮绑定删除事件
      $('tbody').on('click', '.btn-delete', function() {
          // 获取删除按钮的个数
          var len = $('.btn-delete').length
          // 获取文章的ID
          var id = $(this).attr('data-id')
          // 询问用户是否删除数据
          layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
              method: 'GET',
              url: '/my/article/delete/' + id,
              success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                      if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                      }
                      initTable()
                  }
              })
              layer.close(index)
          })
      })

})