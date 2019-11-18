<template>
  <div class="page-role">
    <div id="canvas"></div>
  </div>
</template>

<script>
  import permission from '@/components/mixin/permission';
  import G6 from '@antv/g6'
  export default {
    mixins: [permission],
    name: 'role',
    data() {
      return {
      }
    },
    methods: {
      // 加载
      load() {
        // radius: 10,
        // anchorPoints: [
        //  [0, 0.5], // 左侧中间
        //  [1, 0.5] // 右侧中间
        // ]
        const data = {
          nodes: [{
            id: 'node1',
            x: 100,
            y: 200
          },{
            id: 'node2',
            x: 300,
            y: 200
          }, {
            id: 'node3',
            x: 400,
            y: 400
          }],
          edges: [{
            source: 'node1',
            target: 'node2'
          }]
        };


//        如果不从任何现有的节点扩展新节点时，draw 方法是必须的
//        update 方法可以不定义，数据更新时会走 draw 方法，所有图形清除重绘
//        afterDraw，afterUpdate 方法一般用于扩展已有的节点/和边，例如：在矩形上附加图片，线上增加动画等
//        setState 方法一般也不需要复写，有全局的样式可以替换
//        getAnchorPoints 方法仅在需要限制与边的连接点时才需要复写，也可以在数据中直接指定
//        G6.registerNode('nodeName', {
//          /**
//           * 绘制节点/边，包含文本
//           * @param  {Object} cfg 节点的配置项
//           * @param  {G.Group} group 节点的容器
//           * @return {G.Shape} 绘制的图形，通过node.get('keyShape') 可以获取到
//           */
//          draw(cfg, group) {},
//          /**
//           * 绘制后的附加操作，默认没有任何操作
//           * @param  {Object} cfg 节点的配置项
//           * @param  {G.Group} group 节点的容器
//           */
//          afterDraw(cfg, group) {},
//          /**
//           * 更新节点，包含文本
//           * @override
//           * @param  {Object} cfg 节点的配置项
//           * @param  {Node} node 节点
//           */
//          update(cfg, node) {},
//          /**
//           * 更新节点后的操作，一般同 afterDraw 配合使用
//           * @override
//           * @param  {Object} cfg 节点的配置项
//           * @param  {Node} node 节点
//           */
//          afterUpdate(cfg, node) {},
//          /**
//           * 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现
//           * 单图形的节点仅考虑 selected、active 状态，有其他状态需求的用户自己复写这个方法
//           * @param  {String} name 状态名称
//           * @param  {Object} value 状态值
//           * @param  {Node} node 节点
//           */
//          setState(name, value, node) {},
//          /**
//           * 获取控制点
//           * @param  {Object} cfg 节点、边的配置项
//           * @return {Array|null} 控制点的数组,如果为 null，则没有控制点
//           */
//          getAnchorPoints(cfg) {}
//        }, extendNodeName);

        G6.registerNode('testKeyShape', {
          // 绘制 group是antv/g里面的绘图对象
          draw(cfg, group) {
            const circle = group.addShape('circle', {
              attrs: {
                x: 0,
                y: 0,
                r: 10,
                stroke: '#444',
                fill: '#ccc'
              }
            });
            const text = group.addShape('text', {
              attrs: {
                x: 0,
                y: -20,
                textAlign: 'center',
                text: cfg.label,
                fill: '#444'
              }
            });
            return circle;
          }
        });

//        G6.registerNode('inner-animate', {
//          afterDraw(cfg, group) {
//            const size = cfg.size;
//            const width = size[0] - 14;
//            const height = size[1] - 14;
//            // 添加图片
//            const image = group.addShape('image', {
//              attrs: {
//                x: - width / 2,
//                y: - height / 2,
//                width: width,
//                height: height,
//                img: cfg.img
//              }
//            });
//            // 执行旋转动画
//            image.animate({
//              onFrame(ratio) {
//                const matrix = Util.mat3.create();
//                const toMatrix = Util.transform(matrix, [
//                  ['r', ratio * Math.PI * 2]
//                ]) ;
//                return {
//                  matrix: toMatrix
//                };
//              },
//              repeat: true
//            }, 3000, 'easeCubic');
//          }
//        }, 'rect');

//        我们推荐用户使用第二种方式来实现节点的状态调整：
//        在 G6 的自定义节点/边的设计中我们提供了一个接口 setState 方法便于用户进行节点的状态的设置
//        通过 graph.setItemState() 方法来设置状态
//        // 基于 rect 扩展出新的图形
//        G6.registerNode('custom', {
//          // 设置状态
//          setState(name, value, item) {
//            const group = item.getContainer();
//            const shape = group.get('children')[0]; // 顺序根据 draw 时确定
//            if(name === 'selected') {
//              if(value) {
//                shape.attr('fill', 'red');
//              } else {
//                shape.attr('fill', 'white');
//              }
//            }
//          }
//        }, 'rect');
//
//        // 点击时选中，再点击时取消
//        graph.on('node:click', ev=> {
//          const node = ev.item;
//          graph.setItemState(node, 'selected', !node.hasState('selected')); // 切换选中
//        });


        // G6 并未限定节点的状态，只要你在 setState 方法中进行处理你可以实现任何交互。例如：
//        G6.registerNode('custom', {
//          // 设置状态
//          setState(name, value, item) {
//            const group = item.getContainer();
//            const shape = group.get('children')[0]; // 顺序根据 draw 时确定
//            if(name === 'running') {
//              if(value) {
//                shape.animate({
//                  r: 20,
//                  repeat: true
//                }, 1000);
//              } else {
//                shape.stopAnimate();
//                shape.attr('r', 10);
//              }
//            }
//          }
//        }, 'circle');
//
//        // 鼠标移动到上面 running，移出结束
//        graph.on('node:mouseenter', ev=> {
//          const node = ev.item;
//          graph.setItemState(node, 'running', true);
//        });
//        graph.on('node:mouseleave', ev=> {
//          const node = ev.item;
//          graph.setItemState(node, 'running', false);
//        });


        // 封装点击添加边的交互
        G6.registerBehavior('click-add-edge', {
          // getDefaultCfg: 返回配置的默认值，可以在graph中复写配置，在事件回调中用 this[defaultCfg] 获取配置。
//          getDefaultCfg() {
//            return {
//              multiple: true
//            };
//          },
          getEvents() {
            return {
              'node:click': 'onClick' ,
              mousemove: 'onMousemove'
            };
          },
          onClick(ev) {
            const node = ev.item;
            const graph = this.graph;
            const point = {x: ev.x, y: ev.y};
            const model = node.getModel();
            // 如果在添加边的过程中，再次点击另一个节点，结束边的添加
            if (this.addingEdge && this.edge) {
              graph.updateItem(this.edge, {
                target: model.id
              });
              this.edge = null;
              this.addingEdge = false;
            } else {
              // 点击节点，触发增加边
              this.edge = graph.addItem('edge', {
                source: model.id,
                target: point
              });
              this.addingEdge = true;
            }
          },
          onMousemove(ev) {
            const point = {x: ev.x, y: ev.y};
            if (this.addingEdge && this.edge) {
              // 增加边的过程中，移动时边跟着移动
              this.graph.updateItem(this.edge, {
                target: point
              });
            }
          }
        });

        const graph = new G6.Graph({
          container: 'canvas',
          width: 500,
          height: 500,
          modes: { // 支持的 behavior
            default: [
              'click-select',
              {
                type: 'drag-node',
                delegate: false,
              },
              'drag-canvas',
              'click-add-edge'
            ]
          },
//          nodeStyle: {
//            // 节点在默认状态下的样式
//            default: {
//              fill: '#40a9ff',
//              stroke: '#096dd9'
//            },
//            // 当节点在 selected 状态下的样式
//            selected: {
//              lineWidth: 2,
//              fillOpacity: 0.8
//            }
//          },
        });
        graph.data(data);
        graph.render();
      },
    },
    mounted() {
      this.load();
    }
  }
</script>

<style>
  .page-role {
    height: 100%;
    position: relative;
  }
  #canvas {
    height: 500px;
    width: 500px;
  }
</style>
