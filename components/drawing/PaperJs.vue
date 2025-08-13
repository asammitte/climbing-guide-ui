<template>
  <div class="paper-js-component">
    <div class="canvas-container">
      <canvas id="paper-canvas" ref="canvas" @mousedown="mouseDown"></canvas>
    </div>
    <div class="tools-container">
      <div class="tool-btn pencil-tool" @click="activateTool('toolPath')">
        <md-icon
          type="mdi"
          :path="mdiPencil"
          :size="24"
        />
      </div>
      <div class="tool-btn pencil-tool" @click="activateTool('toolExtension')">
        <md-icon
          type="mdi"
          :path="mdiStickerCircleOutline"
          :size="24"
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import paper from 'paper'
import { ref, onMounted } from 'vue'
import MdIcon from '@/components/common/MdIcon.vue'
import {
  mdiPencil,
  mdiStickerCircleOutline,
} from '@mdi/js'

const canvas = ref(null)
let scope = null
let path
let tools = []

onMounted(()=>{
  scope = new paper.PaperScope()
  scope.setup('paper-canvas')
  // scope.activate()

  scope.tools = [toolPath(), toolExtension()]

  // create drawing tool
  // tool = createTool(scope)

  // createToolListeners(scope)
  // Activate a certain Tool
  activateTool('toolPath')
})

// class ToolStack {
//   constructor(tools) {
//     this.tools = tools.map(tool => tool())
//   }

//   activateTool(name) {
//     const tool = this.tools.find(tool => tool.name === name)
//     tool.activate()
//   }

//   // add more methods here as you see fit ...
// }

// const activateTool = (name) => {
//   const tool = tools.find(tool => tool.name === name)
//   tool.activate()
// }

const toolPath = () => {
  const tool = new paper.Tool()
  tool.name = 'toolPath'

  // let path

  tool.onMouseDown = (event) => {
    console.log('mouse down')
    path = pathCreate(scope)

    // add point to path
    path.add(event.point)
  }

  tool.onMouseDrag = (event) => {
    path.add(event)
  }

  tool.onMouseUp = (event) => {
    // line completed
    path.add(event.point)

    path.name = 'some unique name'
    path.simplify(10)
  }

  return tool
}

const pathCreate = (scope) => {
  scope.activate()

  return new paper.Path({
    strokeColor: "#000000",
    strokeJoin: 'round',
    strokeWidth: 3
  })
}


const toolExtension = () => {
  const tool = new paper.Tool()
  tool.name = 'toolExtension'

  // let path

  // tool.onMouseDown = function(event) {
  //   path = new paper.Path.Circle({
  //     center: event.point,
  //     radius: 30,
  //     fillColor: '#9C27B0'
  //   })
  // }

  let extension

  var circle = new paper.Path.Circle({
    // center: view.center,
    radius: 7,
    fillColor: 'red'
  })

  tool.onMouseDown = (event) => {
    extension = pathCreate(scope)

    extension.add(circle.position)

    // add point to path
    extension.add(event.point)

    // Get the nearest point from the mouse position
    // to the star shaped path:
    var nearestPoint = path.getNearestPoint(event.point);

    // Move the red circle to the nearest point:
    circle.position = nearestPoint;
  }

  tool.onMouseMove = (event) => {
    // Get the nearest point from the mouse position
    // to the star shaped path:
    var nearestPoint = path.getNearestPoint(event.point);

    // Move the red circle to the nearest point:
    circle.position = nearestPoint
  }

  tool.onMouseDrag = (event) => {
    if (!!extension) {
      extension.add(event)
    }
  }

  tool.onMouseUp = event => {
    extension.add(event.point)

    extension.name = 'some unique name'
    extension.simplify(10)

    var intersections = extension.getIntersections(path)

    for (var i = 0; i < intersections.length; i++) {
      new paper.Path.Circle({
        center: intersections[i].point,
        radius: 8,
        fillColor: '#009dec'
      });
    }
  }

  return tool
}

// Construct a Toolstack, passing your Tools
// const toolStack = new ToolStack([toolPath, toolCircle])


const activateTool = (name) => {
  const tool = scope.tools.find(tool => tool.name === name)
  console.log('----')
  console.log(scope)
  console.log(tool)
  tool.activate()
}

const createTool = (scope) => {
  scope.activate()
  return new paper.Tool()
}

const createToolListeners = (scope) => {
  let path
  let tool

  scope.activate()
  tool = new paper.Tool()

  tool.onMouseDown = (event) => {
    path = pathCreate(scope)

    // add point to path
    path.add(event.point)
  }

  tool.onMouseDrag = (event) => {
    path.add(event)
  }

  tool.onMouseUp = (event) => {
    // line completed
    path.add(event.point)

    path.name = 'some unique name'
    path.simplify(10)
  }
}

const mouseDown = () => {}
</script>

<style lang="scss" scoped>
.paper-js-component {
  display: flex;

  .canvas-container {
    padding: 4px;

    canvas {
      border: 2px solid green;
      border-radius: 16px;
      width: calc(80vw - 4px);
    }
  }

  .tools-container {
    padding: 4px;

    .tool-btn {
      margin: 0 4px 4px 4px;
      padding: 4px;
      border: 1px solid black;
    }
  }
}
</style>
