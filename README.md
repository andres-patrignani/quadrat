# Quadrat

Quadrat is a digital and interactive version of the common quadrats, grids, or wire frames used in the field for 
quantifying the abundance and cover of plant communities. Typically multiple quadrats are required in field conditions. The Quadrat web application is aimed at simplifying (when possible) field work by analyzing digital images. The digiral quadrat provides some advantages:

- Images collected in the field can be re-analyzed at any time
- Labeled images and the associated metadata (e.g. grid size, label descriptions, postion of each label, etc.) can be saved and become part of the project's documentation.
- The interactive quadrat allows for fast labeling and erasing.
- Set up custom grids to better fit different individuals and communities.
- The web application does not require any software download or sign in.
- Ensures user privacy by working with and saving files to your hard drive. Nothing is shared with or sent to an external server.
- Once loaded in your browser, Quadrat will also work offline and in mobile devices.

We recognize that a digital quadrat cannot replace field research since images represent a static view of the system under study and some organisms are difficult to identify from still images. Quadrat also resizes the image to fit in the screen so that the user does not need to scroll while labeling. This conveninet feature can result in the loss of some detail.

## Instructions

**Step 1**: Load an image

**Step 2**: Create a rectangular grid ranging anywhere from 9 cells (3 by 3 grid) to 625 cells (25 by 25 grid). The grid can also accept any combination of rows and columns, meaning that rectangular cells are possible in either direction. Changing the grid will result in erasing all the information associated with the current grid, so be careful.

**Step 3**: Add as many labels as you want. Each label accepts a custom color and a description. The custom color will aensure proper contrast with the background image.

**Step 4**: Label the image using the mouse cursor. Colors have a transparency to see what is underneath the label (at least to some extent). Cell labels are mutually exclusive, meaning that each cell can only accept one label.

**Step 5**: Download the labeled canvas, a spreadsheet with the labels for each cell. We also provide the option of downloading a [JSON](https://www.wikiwand.com/en/JSON) file with all the information including label names, descriptions, colors, etc.


For feedback or ideas, please contact andrespatrignani@ksu.edu. We are interesting on how you are suign this tool for research and teaching.



This tool was built using two awesome libraries: [Materialize](https://materializecss.com/) and [p5](https://p5js.org/)
