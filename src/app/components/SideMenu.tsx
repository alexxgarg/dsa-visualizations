import React, { useContext, useState } from 'react';
import { Accordion, Button, Dropdown, ListGroup } from 'react-bootstrap';
import '../../../styles/sideMenu.css';
import AppContext from '@/context';

export const items = [
  {
    category: 'Arrays',
    categoryValue: 0,
    subCategories:[
      {
        subCategoryName: 'Bubble Sort',
        subCategoryValue: 0,
      },
      {
        subCategoryName: 'Insertion Sort',
        subCategoryValue: 1,
      },
      {
        subCategoryName: 'Selection Sort',
        subCategoryValue: 2,
      },
      {
        subCategoryName: 'Merge Sort',
        subCategoryValue: 3,
      },
      {
        subCategoryName: 'Quick Sort',
        subCategoryValue: 4,
      }
    ]
  },
  {
    category: 'Tree Traversal Algorithms',
    categoryValue: 1,
    subCategories:[
      {
        subCategoryName: 'In-Order Traversal',
        subCategoryValue: 0,
      },
      {
        subCategoryName: 'Pre-Order Traversal',
        subCategoryValue: 1,
      },
      {
        subCategoryName: 'Post-Order Traversal',
        subCategoryValue: 2,
      }
    ]
  },
  {
    category: 'Graph Traversal Algorithms',
    categoryValue: 2,
    subCategories:[
      {
        subCategoryName: 'Depth First Search',
        subCategoryValue: 0,
      },
      {
        subCategoryName: 'Breadth First Search',
        subCategoryValue: 1,
      },
      {
        subCategoryName: 'Djikstra Algorithm',
        subCategoryValue: 2,
      }
    ]
  }
]

const SideMenu: React.FC = () => {

  const {
    setVisualizationCategory,
    setVisualizationOption
  } = useContext(AppContext);

  const onClick = (visualizationCategory: number,visualizationOption: number) =>{
    setVisualizationCategory(visualizationCategory);
    setVisualizationOption(visualizationOption);
  }

  return (
    <div style={{
      display: 'flex',
      width: '70%',
      justifyContent: 'space-evenly',
      position: 'absolute',
      padding: '10px',
      backgroundColor: 'cadetblue',
      borderStyle: 'solid',
      borderColor: 'white',
      borderLeftWidth: 0,
      borderRightWidth: 0
    }}>
            {
              items.map((item,index)=>{
                return(
                <Dropdown>
                      <Dropdown.Toggle >
                        {item.category}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                      {
                          item.subCategories.map((subItem)=>{
                            return(<Dropdown.Item key={subItem.subCategoryValue} onClick={()=>{
                              onClick(item.categoryValue,subItem.subCategoryValue);
                            }}>{subItem.subCategoryName}</Dropdown.Item>)
                          })
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                )
              })
            }
    </div>
  );
};

export default SideMenu;
