﻿# TimeTask


最初设想
文件上传后 根据文件变化自动压缩文件，可是文件是文件变化是优先数据库数据变化的，但是在压缩的时候需要读取文件的具体未知，因此此想法无效
然后通过读取数据库数据变化而去压缩文件，这样可以便于以后加上审核或者删除文件等功能
为了让源文件不占用存储空间在压缩后自动删除源文件