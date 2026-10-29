// Based on react-native-tags-input 1.0.10 (with the old patch-package changes)
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

class TagInput extends React.Component {
  addTag = (tag) => {
    const { tags, updateState } = this.props
    updateState({
      tag: '',
      tagsArray: [...new Set([...tags.tagsArray, tag])] // Deduplication
    })
    this.input?.clear()
  }

  // If characters remain in the input field after input is completed, add them to the tag.
  onEndEditing = () => {
    const { tags } = this.props
    if (tags.tag) {
      this.addTag(tags.tag)
    }
  }

  onChangeText = (text) => {
    const { tags, updateState, keysForTag } = this.props
    const key = typeof keysForTag === 'string' ? keysForTag : ' '
    if (text.includes(key)) {
      if (text === key) {
        return
      }
      return this.addTag(text.replace(key, ''))
    }
    updateState({
      tag: text,
      tagsArray: tags.tagsArray
    })
  }

  deleteTag = (index) => {
    const { tags, updateState } = this.props
    updateState({
      tag: tags.tag,
      tagsArray: tags.tagsArray.filter((_, i) => i !== index)
    })
  }

  render() {
    const {
      containerStyle,
      inputStyle,
      tags,
      renderTag,
      updateState,
      keysForTag,
      ...otherProps
    } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          underlineColorAndroid="transparent"
          placeholderTextColor="rgba(255,255,255,0.5)"
          {...otherProps}
          ref={ref => {
            this.input = ref;
          }}
          style={[styles.input, inputStyle]}
          value={tags.tag}
          onChangeText={this.onChangeText}
          onEndEditing={this.onEndEditing}
        />
        {tags?.tagsArray?.length ?
          <View style={styles.tagsView}>
            {tags.tagsArray.map((item, index) => (
              <React.Fragment key={item}>
                {renderTag({
                  item,
                  count: index,
                  deleteTag: () => this.deleteTag(index)
                })}
              </React.Fragment>
            ))}
          </View> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    flex: 1,
    minHeight: 30,
  },
  tagsView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
});

export default TagInput;
