
```
bower install --save startSass
npm install --save startsass
```


### $colors,$w,以及media查询的数值都是可以动态修改
```sass
//便于循环编写css 目前没有找到更好的办法
$color:( "primary":red, // 主题颜色
"title":#333, // 标题色
"sub":#999, //副标题色
"content":#666, //文字内容色
"grey":#fcfcfc,
"white":#fff, //白色
"black":#000, //黑色
"bg":#1d3e56, //背景颜色
"bgLight":#363636, //稍浅背景颜色
"greyBg":#fafafa, //浅色背景颜色
"greyDark":#f2f2f2,
"border":#eaeefb,
"borderLight":#f3f3f3,
"success":#57c90c,
"error":#ff4048,
"choose":#ffeced)!default;
@function color($n) {
    @return map-get($color,$n);
}
$w :1500px!default;
// ==========================================================================

// Media Query Ranges
$small-screen-up: 601px !default;
$medium-screen-up: 993px !default;
$large-screen-up: 1201px !default;
$small-screen: 600px !default;
$medium-screen: 992px !default;
$large-screen: 1200px !default;

$medium-and-up: "only screen and (min-width : #{$small-screen-up})" !default;
$large-and-up: "only screen and (min-width : #{$medium-screen-up})" !default;
$extra-large-and-up: "only screen and (min-width : #{$large-screen-up})" !default;
$small-and-down: "only screen and (max-width : #{$small-screen})" !default;
$medium-and-down: "only screen and (max-width : #{$medium-screen})" !default;
$medium-only: "only screen and (min-width : #{$small-screen-up}) and (max-width : #{$medium-screen})" !default;
$w-and-up: "only screen and (min-width : #{$w})" !default;
$w-and-down: "only screen and (max-width : #{$w})" !default;
```




| class 名称      | 描述 | 举例 |
| ------------ | :----- |---------|
| color-[$color]        | 文本颜色控制  | color-primary |
| bg-[$color]        | 背景颜色控制  |bg-title |
| border-[$color]        | 边控颜色控制  | border-title|
| a-hover-[$color]        | hover颜色控制  | a-hover-title|
| mt[$num] (0-80)       | margin-top:$num  | mt10|
| ml[$num] (0-80)         | margin-left:$num  | ml10|
| mr[$num] (0-80)         | margin-right:$num  | mr10|
| mb[$num]  (0-80)        | margin-bottom:$num  | mb10|
| mt-[$num]  (0-80)       | margin-top:-$num  | mt-10|
| pd[$num]  (0-80)       | padding:$num  | pd10|
| pd-l[$num]  (0-80)       | padding-left:$num  | pd-10|
| z-depth-[$num] (0-5)     | 阴影  | z-depth-1|

> 更多详细可查看源码
