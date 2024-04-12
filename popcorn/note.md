Component (Instance) LifeCycle 

### 1. MOUNT/INITIAL RENDER
a.Component instance is rendered for the first time 
b.Fresh state and props are created 

### 2.RE-RENDER
This Happens when 
a.State changes
b.props change
c.Parent re-renders
c.Context changes 

### 3.UNMOUNT 
This happenes when a componet instance is destroyed and removed

State and props  are destoryed 

It is not advisible to set state into render LOGIC, because it will run for ever 

