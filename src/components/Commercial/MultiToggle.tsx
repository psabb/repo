import React, { Component } from "react";
import MultiToggle from "react-multi-toggle";
import "./MultiToggle.css";
import { Question } from "./optionsData"; // Assuming that the Question type is exported from the optionsData file

// Define the type for the ExampleProps
interface ExampleProps {
  onCategorySelect: (categoryValue: number) => void;
}

const groupOptions = [
  {
    displayName: "Commercial",
    value: 2,
    description: "Description for Commercial department",
  },
  {
    displayName: "Technical",
    value: 3,
    description: "Description for Technical department",
  },
  {
    displayName: "Legal",
    value: 4,
    description: "Description for Legal department",
  },
  {
    displayName: "Procurement",
    value: 5,
    description: "Description for Procurement department",
  },
  {
    displayName: "General",
    value: 1,
    description: "Description for General department",
  },
];

export class Example extends Component<ExampleProps> {
  state = {
    groupSize: 2,
    showDescription: true,
  };

  onGroupSizeSelect = (value: number) => {
    this.setState({ groupSize: value, showDescription: true });
    this.props.onCategorySelect(value); // Pass the selected category value to the parent component
  };

  render() {
    const { groupSize, showDescription } = this.state;
    const selectedOption = groupOptions.find(
      (option) => option.value === groupSize
    );

    return (
      <div>
        <MultiToggle
          options={groupOptions}
          selectedOption={groupSize}
          onSelectOption={this.onGroupSizeSelect}
          label="Select your category to upload the file:"
        />
        {selectedOption && (
          <p className={`description ${showDescription ? "fade-in" : ""}`}>
            {selectedOption.description}
          </p>
        )}
      </div>
    );
  }
}
